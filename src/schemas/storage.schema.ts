import {z} from "zod";
import {BookSchema} from "./book.schema";

/** Schema for the array of saved books persisted per-user in localStorage. */
export const SavedBooksStorageSchema = z.array(BookSchema);

/** Schema for the pending-save book written to sessionStorage before login. */
export const PendingBookStorageSchema = BookSchema;

/** Schema for the rate-limiter record stored in localStorage per username. */
export const RateLimitRecordSchema = z.object({
	attempts: z.number().int().min(0),
	blockedUntil: z.number().int().min(0),
});

export type RateLimitRecord = z.infer<typeof RateLimitRecordSchema>;

/** Schema for a password-reset record stored in localStorage. */
export const ResetRecordSchema = z.object({
	code: z.string().length(6),
	expiry: z.number().int().positive(),
});

export type ResetRecord = z.infer<typeof ResetRecordSchema>;
