import {z} from "zod";
import {UserSchema} from "./user.schema";

/** Shared base for both success and failure auth results. */
const AuthResultBase = z.object({success: z.boolean()});

/** Shape returned on a successful auth operation. */
export const AuthSuccessSchema = AuthResultBase.extend({
	success: z.literal(true),
	user: UserSchema,
});

/** Shape returned on a failed auth operation. */
export const AuthFailureSchema = AuthResultBase.extend({
	success: z.literal(false),
	message: z.string(),
});

/**
 * Discriminated union covering every possible auth service response.
 * Zod will pick the correct branch via the `success` discriminant.
 */
export const AuthResultSchema = z.discriminatedUnion("success", [
	AuthSuccessSchema,
	AuthFailureSchema,
]);

/** TypeScript type derived from AuthResultSchema. */
export type AuthResult = z.infer<typeof AuthResultSchema>;
export type AuthSuccess = z.infer<typeof AuthSuccessSchema>;
export type AuthFailure = z.infer<typeof AuthFailureSchema>;

/** Result shape returned by forgotPassword when the email was sent. */
export const ForgotPasswordResultSchema = z.object({
	success: z.literal(true),
	email: z.string().email(),
	/** True when EmailJS was configured and the email was dispatched. */
	sent: z.boolean(),
	/** Present in dev/mock mode when no real email is sent. */
	devCode: z.string().optional(),
});

export type ForgotPasswordResult = z.infer<typeof ForgotPasswordResultSchema>;

/** Combined forgot-password response (success or failure). */
export const ForgotPasswordResponseSchema = z.discriminatedUnion("success", [
	ForgotPasswordResultSchema,
	AuthFailureSchema,
]);

export type ForgotPasswordResponse = z.infer<typeof ForgotPasswordResponseSchema>;
