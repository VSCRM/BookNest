/**
 * Toggles the saved state of an book on a BookCard.
 *
 * React 19 — useOptimistic
 * ────────────────────────
 * The UI updates immediately (optimistic) before the async operation
 * completes.  If the operation fails, React automatically rolls back to
 * the previous state.  This eliminates the perceived lag users see when
 * waiting for an API call.
 *
 * When the user is not authenticated, clicking save stores the book in
 * sessionStorage as a pending action (key 'bp_pending_save') and redirects
 * to /login.  After login the AuthProvider reads this pending book and
 * saves it automatically via popPendingBook().
 */
import {useOptimistic, useCallback, startTransition} from "react";
import {useNavigate} from "react-router";
import type {Book} from "../schemas";
import {useAuth} from "./useAuth";
import {logger} from "../utils/logger";

/** Storage key for the book the user tried to save while logged out. */
export const PENDING_SAVE_KEY = "bp_pending_save";

interface UseSaveBookResult {
	isSaved: boolean;
	handleSave: (e?: React.MouseEvent) => void;
}

export function useSaveBook(book: Book): UseSaveBookResult {
	const {user, savedBooks, saveBook, unsaveBook} = useAuth();
	const navigate = useNavigate();

	const isRealSaved = savedBooks.some((a) => a.id === book.id);

	/** Optimistic state: flips immediately, rolls back on error. */
	const [optimisticSaved, setOptimisticSaved] = useOptimistic(isRealSaved);

	const handleSave = useCallback(
		(e?: React.MouseEvent): void => {
			e?.stopPropagation();
			e?.preventDefault();

			if (!user) {
				// Store the book so AuthProvider can restore it after login/register.
				try {
					sessionStorage.setItem(PENDING_SAVE_KEY, JSON.stringify(book));
				} catch {
					// sessionStorage can be blocked in some browsers — fail gracefully.
				}
				void navigate("/login");
				return;
			}

			const wasOptimisticSaved = optimisticSaved;

			// Wrap in startTransition to satisfy React 19's requirement that
			// useOptimistic updates happen inside a transition or async action.
			startTransition(() => {
				setOptimisticSaved(!wasOptimisticSaved);
			});

			(wasOptimisticSaved
				? Promise.resolve(unsaveBook(book.id))
				: Promise.resolve(saveBook(book))
			).catch((err: unknown) => {
				logger.error("Save book failed", err, "useSaveBook");
				// useOptimistic automatically reverts on error.
			});
		},
		[user, optimisticSaved, book, navigate, saveBook, unsaveBook, setOptimisticSaved],
	);

	return {
		isSaved: optimisticSaved,
		handleSave,
	};
}
