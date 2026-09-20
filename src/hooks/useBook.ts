/**
 * Fetches the book list for the active locale.
 *
 * Re-fetches automatically when the user switches language — the locale
 * is included in the useEffect dependency array so a new request fires
 * with the correct locale whenever it changes.
 */
import {useState, useEffect} from "react";
import {bookService} from "../services/bookService";
import {useLocale} from "../i18n/LocaleContext";
import type {Book} from "../schemas";
import {GENRES_BY_LOCALE} from "../mock/bookData";

interface UseBookResult {
	books: Book[];
	genres: string[];
	loading: boolean;
	/** Raw message only — callers that display it (e.g. HomeError) add the
	 *  "Помилка: " / "Error: " prefix themselves. Don't prefix it here too,
	 *  or it gets doubled up on screen. */
	error: string | null;
	/** Re-runs the fetch without waiting for a locale change — wire this up
	 *  to a "Try again" button. */
	refetch: () => void;
}

export function useBook(): UseBookResult {
	const {locale, t} = useLocale();

	const [books, setBooks] = useState<Book[]>([]);
	const [genres, setGenres] = useState<string[]>([...GENRES_BY_LOCALE[locale]]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	// Bumping this re-runs the effect below on demand (see `refetch`).
	const [retryCount, setRetryCount] = useState(0);

	useEffect(() => {
		const controller = new AbortController();

		const fetchBooks = async (): Promise<void> => {
			try {
				setLoading(true);
				setError(null);

				const data = await bookService.getAll(controller.signal, locale);
				if (controller.signal.aborted) return;

				setBooks(data);

				// Build unique genre list; keep locale-specific "All" sentinel first.
				const allLabel = GENRES_BY_LOCALE[locale][0] ?? t.home.allGenres;
				const unique = Array.from(new Set(data.map((a) => a.genre)));
				setGenres([allLabel, ...unique]);
			} catch (err) {
				if (controller.signal.aborted) return;
				setError(err instanceof Error ? err.message : t.home.loadError);
			} finally {
				if (!controller.signal.aborted) setLoading(false);
			}
		};

		void fetchBooks();
		return () => controller.abort();
	}, [locale, retryCount]); // re-fetch when language switches or retry is requested

	return {
		books,
		genres,
		loading,
		error,
		refetch: () => setRetryCount((n) => n + 1),
	};
}
