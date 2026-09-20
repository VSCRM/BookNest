import {StoredUserSchema} from "../schemas/user.schema";
import type {User} from "../schemas";

const TOKEN_KEY = "bp_token";
const USER_KEY = "bp_user";

/**
 * Typed wrapper around localStorage for auth-related persistence.
 *
 * `getUser` validates the stored value with `StoredUserSchema` (Zod) before
 * returning it, so callers always receive a well-typed `User | null` rather
 * than a blindly-cast object that might contain stale or malicious extra keys.
 */
export const storage = {
	getToken: (): string | null => localStorage.getItem(TOKEN_KEY),
	setToken: (token: string): void => localStorage.setItem(TOKEN_KEY, token),

	/**
	 * Reads and Zod-validates the stored user from localStorage.
	 * Returns `null` (and removes the entry) if the stored value is missing,
	 * unparseable, or fails schema validation.
	 */
	getUser: (): User | null => {
		try {
			const raw = localStorage.getItem(USER_KEY);
			if (!raw) return null;

			const parsed: unknown = JSON.parse(raw);
			const result = StoredUserSchema.safeParse(parsed);

			if (!result.success) {
				// Remove stale or tampered data so it doesn't accumulate.
				localStorage.removeItem(USER_KEY);
				return null;
			}

			return result.data;
		} catch {
			localStorage.removeItem(USER_KEY);
			return null;
		}
	},

	setUser: (user: User): void => localStorage.setItem(USER_KEY, JSON.stringify(user)),

	clearAuth: (): void => {
		localStorage.removeItem(TOKEN_KEY);
		localStorage.removeItem(USER_KEY);
	},
};
