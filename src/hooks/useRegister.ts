import {useCallback, type Dispatch, type SetStateAction} from "react";
import {authService} from "../services/authService";
import {popPendingBook} from "../context/popPendingBook";
import {createSession} from "../security/sessionGuard";
import {sanitizeEmail, sanitizeNickname} from "../utils/sanitize";
import type {User, Book, AuthResult} from "../schemas";

/**
 * Produces a memoised `register` function that handles session creation
 * and pending-book handling after a successful registration.
 */
export function useRegister(
	setUser: Dispatch<SetStateAction<User | null>>,
	setSavedBooks: Dispatch<SetStateAction<Book[]>>,
	setLoading: Dispatch<SetStateAction<boolean>>,
): (rawEmail: string, password: string, rawNickname: string) => Promise<AuthResult> {
	return useCallback(
		async (
			rawEmail: string,
			password: string,
			rawNickname: string,
		): Promise<AuthResult> => {
			const email = sanitizeEmail(rawEmail);
			const nickname = rawNickname
				? sanitizeNickname(rawNickname)
				: (email.split("@")[0] ?? email);

			setLoading(true);
			try {
				const result = await authService.register(email, password, nickname);

				if (result.success) {
					createSession(result.user.username);
					setUser(result.user);
					const pending = popPendingBook();
					setSavedBooks(pending ? [pending] : []);
				}

				return result;
			} finally {
				setLoading(false);
			}
		},
		[setUser, setSavedBooks, setLoading],
	);
}
