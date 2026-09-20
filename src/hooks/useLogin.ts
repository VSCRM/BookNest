import {useCallback, type Dispatch, type SetStateAction} from "react";
import config from "../config";
import {authService} from "../services/authService";
import {savedBooksService} from "../services/savedBooksService";
import {readSavedBooks} from "../context/readSavedBooks";
import {mergePendingBook} from "../context/mergePendingBook";
import {createSession} from "../security/sessionGuard";
import {
	checkRateLimit,
	recordFailedAttempt,
	clearRateLimit,
} from "../security/rateLimiter";
import {sanitizeEmail} from "../utils/sanitize";
import {logger} from "../utils/logger";
import type {User, Book, AuthResult} from "../schemas";

/**
 * Produces a memoised `login` function that handles rate-limiting,
 * session creation, and pending-book merging after a successful auth.
 */
export function useLogin(
	setUser: Dispatch<SetStateAction<User | null>>,
	setSavedBooks: Dispatch<SetStateAction<Book[]>>,
	setLoading: Dispatch<SetStateAction<boolean>>,
): (rawEmail: string, password: string) => Promise<AuthResult> {
	return useCallback(
		async (rawEmail: string, password: string): Promise<AuthResult> => {
			const email = sanitizeEmail(rawEmail);

			const blocked = checkRateLimit(email);
			if (blocked) return {success: false, message: blocked};

			setLoading(true);
			try {
				const result = await authService.login(email, password);

				if (result.success) {
					createSession(result.user.username);
					clearRateLimit(email);
					setUser(result.user);

					// In mock mode: read saved books from localStorage.
					// In real mode: fetch from the API.
					// This is best-effort — a failure here (e.g. the saved-books
					// endpoint being down or 404ing) must NOT undo an already
					// successful login. Fall back to an empty list instead of
					// letting the rejection bubble into the outer catch below.
					let existing: Book[];
					if (config.USE_MOCK) {
						existing = readSavedBooks(result.user.username);
					} else {
						try {
							existing = await savedBooksService.getAll(
								result.user.username,
							);
						} catch (savedBooksErr) {
							logger.error(
								"useLogin: failed to load saved books after login",
								savedBooksErr,
								"useLogin",
							);
							existing = [];
						}
					}

					setSavedBooks(mergePendingBook(result.user.username, existing));
				} else {
					recordFailedAttempt(email);
				}

				return result;
			} catch (err) {
				// authService.login (real API mode) throws instead of returning
				// {success:false,...} whenever the request never got a proper
				// 200-with-envelope response from auth-service — e.g. the
				// service is down, unreachable, blocked by CORS, or timed out.
				// Without this catch the rejection was silent: `loading` still
				// got reset by `finally` below, but no error ever reached the
				// form, so the UI looked like it did nothing at all.
				// Deliberately NOT recordFailedAttempt() here — this wasn't a
				// wrong-credentials rejection from the server, so it shouldn't
				// count against the user's rate limit.
				logger.error("useLogin: login request failed", err, "useLogin");
				return {success: false, message: "network_error"};
			} finally {
				setLoading(false);
			}
		},
		[setUser, setSavedBooks, setLoading],
	);
}
