/**
 * Fetches a single book by the `:id` URL parameter.
 *
 * Uses AbortController to cancel in-flight requests when the component
 * unmounts or the `id` param changes — prevents stale setState in React 19
 * strict-mode double-invocation and rapid navigation.
 *
 * When the user is not authenticated and tries to save, the book is stored
 * in sessionStorage (key 'bp_pending_save') and the user is redirected to
 * /login.  After a successful login or register, AuthProvider automatically
 * restores the pending book via popPendingBook().
 */
import {useState, useEffect} from "react";
import {useParams, useNavigate} from "react-router";
import {bookService} from "../services/bookService";
import {useAuth} from "./useAuth";
import {useLocale} from "../i18n/LocaleContext";
import {PENDING_SAVE_KEY} from "./useSaveBook";
import type {Book} from "../schemas";

interface UseBookDetailResult {
	book: Book | null;
	loading: boolean;
	error: string | null;
	isSaved: boolean;
	handleSave: () => void;
}

export function useBookDetail(): UseBookDetailResult {
	const {id} = useParams<{id: string}>();
	const {user, savedBooks, saveBook, unsaveBook} = useAuth();
	const navigate = useNavigate();
	const {locale, t} = useLocale();

	const [book, setBook] = useState<Book | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!id) return;
		const controller = new AbortController();

		const fetchBook = async (): Promise<void> => {
			try {
				setLoading(true);
				setError(null);
				const data = await bookService.getById(
					Number(id),
					controller.signal,
					locale,
				);
				if (controller.signal.aborted) return;
				setBook(data ?? null);
				if (!data) setError(t.detail.notFound);
			} catch {
				if (controller.signal.aborted) return;
				setError(t.detail.loadError);
			} finally {
				if (!controller.signal.aborted) setLoading(false);
			}
		};

		void fetchBook();
		return () => controller.abort();
	}, [id, locale]);

	const isSaved = !!book && savedBooks.some((a) => a.id === book.id);

	const handleSave = (): void => {
		if (!book) return;

		// Unauthenticated: store book as pending and redirect to login.
		if (!user) {
			try {
				sessionStorage.setItem(PENDING_SAVE_KEY, JSON.stringify(book));
			} catch {
				// sessionStorage may be blocked — fail gracefully.
			}
			void navigate("/login");
			return;
		}

		if (isSaved) {
			unsaveBook(book.id);
		} else {
			saveBook(book);
		}
	};

	return {
		book,
		loading,
		error,
		isSaved,
		handleSave,
	};
}
