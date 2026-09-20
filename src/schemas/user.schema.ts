import {z} from "zod";
import {FIELD_LIMITS} from "../utils/sanitize";

/**
 * The safe, public-facing user object stored in React context and localStorage.
 * This MUST NOT contain bcryptHash or any sensitive credential.
 */
export const UserSchema = z.object({
	/** The user's email address, used as their primary identifier. */
	username: z.string().min(1).max(FIELD_LIMITS.email),
	/** Optional display name chosen at registration or via profile edit. */
	nickname: z.string().max(FIELD_LIMITS.nickname).optional(),
	/**
	 * Authorization role reported by the auth-service (`UserDto.role`).
	 * Optional because a locally-cached `bp_user` (see StoredUserSchema)
	 * never carries it — it is only known right after a fresh /me or
	 * login/register response and re-fetched on every app mount.
	 */
	role: z.enum(["user", "admin"]).optional(),
});

/** TypeScript type derived from UserSchema. */
export type User = z.infer<typeof UserSchema>;

/**
 * Strict schema applied when reading `bp_user` from localStorage.
 * Uses `z.strictObject` (Zod 4) to reject objects that carry extra keys
 * (e.g. bcryptHash) to prevent sensitive data from leaking into the
 * public user object.
 */
export const StoredUserSchema = z.strictObject({
	username: z.string().min(1).max(FIELD_LIMITS.email),
	nickname: z.string().max(FIELD_LIMITS.nickname).optional(),
	role: z.enum(["user", "admin"]).optional(),
});

/** Sort-order union used by useSort and related UI. */
export const SortOrderSchema = z.enum(["asc", "desc"]);
export type SortOrder = z.infer<typeof SortOrderSchema>;
