import {SavedBooksStorageSchema, type Book} from "../schemas";

/**
 * Reads and Zod-validates the saved-books list for `username` from localStorage.
 * Returns an empty array on any error (missing key, invalid JSON, schema mismatch).
 */
export function readSavedBooks(username: string | undefined): Book[] {
	try {
		if (!username) return [];
		const raw = localStorage.getItem(`bp_saved_${username}`);
		if (!raw) return [];
		const parsed: unknown = JSON.parse(raw);
		const result = SavedBooksStorageSchema.safeParse(parsed);
		return result.success ? result.data : [];
	} catch {
		return [];
	}
}
