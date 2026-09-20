import {verifySession} from "../security/sessionGuard";
import {safeParse} from "../utils/sanitize";
import {StoredUserSchema, type User} from "../schemas";

/**
 * Reads `bp_user` from localStorage, validates its shape with Zod,
 * verifies the cryptographic session binding, and returns the user or `null`.
 *
 * Removes the stale entry if validation or session verification fails so the
 * storage does not accumulate invalid data.
 */
export function readLocalUser(): User | null {
	try {
		const raw = localStorage.getItem("bp_user");
		if (!raw) return null;

		const parsed = safeParse(raw);
		const result = StoredUserSchema.safeParse(parsed);

		if (!result.success) {
			localStorage.removeItem("bp_user");
			return null;
		}

		if (!verifySession(result.data.username)) {
			localStorage.removeItem("bp_user");
			return null;
		}

		return result.data;
	} catch {
		return null;
	}
}
