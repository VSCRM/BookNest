import {logger} from "./../utils/logger";
import {useCallback, type Dispatch, type SetStateAction} from "react";
import config from "../config";
import {savedBooksService} from "../services/savedBooksService";
import type {User, Book} from "../schemas";

export interface BookActionsResult {
	saveBook: (book: Book) => "saved" | "redirect";
	unsaveBook: (id: number) => void;
}

/**
 * Low-level save / unsave actions used by AuthProvider.
 * Returns `'saved'` on success, or `'redirect'` when the user is not logged in.
 *
 * In mock mode, persistence is handled by useAuthSync (localStorage).
 * In real mode, each action fires a background API call.
 */
export function useBookActions(
	user: User | null,
	setSavedBooks: Dispatch<SetStateAction<Book[]>>,
): BookActionsResult {
	const saveBook = useCallback(
		(book: Book): "saved" | "redirect" => {
			if (!user) return "redirect";

			setSavedBooks((previous) =>
				previous.some((saved) => saved.id === book.id)
					? previous
					: [...previous, book],
			);

			if (!config.USE_MOCK) {
				savedBooksService.save(user.username, book).catch((err: unknown) => {
					logger.error("saveBook failed", err, "useBookActions");
				});
			}

			return "saved";
		},
		[user, setSavedBooks],
	);

	const unsaveBook = useCallback(
		(id: number): void => {
			setSavedBooks((previous) => previous.filter((saved) => saved.id !== id));

			if (!config.USE_MOCK && user) {
				savedBooksService.remove(user.username, id).catch((err: unknown) => {
					logger.error("unsaveBook failed", err, "useBookActions");
				});
			}
		},
		[user, setSavedBooks],
	);

	return {
		saveBook,
		unsaveBook,
	};
}
