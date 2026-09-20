import {popPendingBook} from "./popPendingBook";
import {savedBooksService} from "../services/savedBooksService";
import config from "../config";
import type {Book} from "../schemas";

/**
 * Folds a book saved while logged out (see useSaveBook.ts's
 * `bp_pending_save` sessionStorage entry) into `existing`, persisting it
 * server-side when running against the real API.
 *
 * Shared by both ways a session can (re)start:
 *  - the regular email/password flow (useLogin.ts), and
 *  - the Google OAuth cookie-hydration path (AuthProvider's `/me` effect).
 *
 * Before this existed, only the email/password path called
 * `popPendingBook()` — signing back in via "Continue with Google" silently
 * dropped whatever book the person tried to save right before being sent
 * to log in, even though the redirect afterwards correctly lands on
 * /profile to show it.
 */
export function mergePendingBook(username: string, existing: Book[]): Book[] {
	const pending = popPendingBook();
	if (!pending || existing.some((saved) => saved.id === pending.id)) {
		return existing;
	}

	const merged = [...existing, pending];

	if (!config.USE_MOCK) {
		savedBooksService.save(username, pending).catch(() => {});
	}

	return merged;
}
