import {PendingBookStorageSchema, type Book} from "../schemas";
import {PENDING_SAVE_KEY} from "../hooks/useSaveBook";

/**
 * Reads and removes the pending-save book from sessionStorage.
 * Uses Zod to validate the stored value so malformed data is silently discarded.
 *
 * @returns The validated Book, or `null` if nothing is pending / data is invalid.
 */
export function popPendingBook(): Book | null {
	try {
		const raw = sessionStorage.getItem(PENDING_SAVE_KEY);
		if (!raw) return null;
		sessionStorage.removeItem(PENDING_SAVE_KEY);
		const parsed: unknown = JSON.parse(raw);
		const result = PendingBookStorageSchema.safeParse(parsed);
		return result.success ? result.data : null;
	} catch {
		return null;
	}
}
