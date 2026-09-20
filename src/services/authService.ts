import {hash, compare, genSalt} from "bcrypt-ts";
import config from "../config";
import {authApi} from "./api";
import {storage} from "./storage";
import {hashPassword} from "../utils/hashPassword";
import {guardFormPayload} from "../security/inputGuard";
import {mockDelay} from "../mock/mockDelay";
import {sanitizeEmail, sanitizeNickname} from "../utils/sanitize";
import {sendResetCode} from "./emailService";
import {z} from "zod";
import {ResetRecordSchema} from "../schemas";
import type {AuthResult, ForgotPasswordResponse, User} from "../schemas";
import {logger} from "../utils/logger";

const BCRYPT_ROUNDS = 10;

/** Generates a random 6-digit numeric code string. */
function generateCode(): string {
	return Math.floor(100_000 + Math.random() * 900_000).toString();
}

/** Interface all auth service implementations must satisfy. */
export interface AuthService {
	login(email: string, password: string): Promise<AuthResult>;
	register(email: string, password: string, nickname: string): Promise<AuthResult>;
	/**
	 * Re-hydrates the current user from the `booknest_jwt` cookie, without
	 * needing a password. Used on app mount (so a page refresh or a
	 * Google OAuth redirect — which never gives the SPA a JS callback —
	 * is picked up) and after `api.ts` silently refreshes an expired
	 * access token.
	 */
	me(): Promise<AuthResult>;
	updateUser(username: string, updates: UpdateUserPayload): Promise<AuthResult>;
	forgotPassword(email: string): Promise<ForgotPasswordResponse>;
	resetPassword(email: string, code: string, newPassword: string): Promise<AuthResult>;
	/**
	 * Tells the server to drop the session: clears the httpOnly
	 * `booknest_jwt` / `booknest_refresh` cookies via `Set-Cookie: ...;
	 * Max-Age=0`. Without this, calling only the local `logout()` in
	 * AuthProvider wipes the React/localStorage state but leaves the real
	 * cookies sitting in the browser until they naturally expire — so the
	 * browser keeps sending them on every request afterwards.
	 * Best-effort: never throws, since local logout must succeed even if
	 * the server is unreachable.
	 */
	logout(): Promise<void>;
}

/** Allowed fields for a profile-update operation. */
export interface UpdateUserPayload {
	nickname?: string;
	password?: string;
}

/**
 * Zod schema for a mock-DB user record stored in localStorage.
 * Kept private to this module — external code works with `User`, not raw records.
 */
const StoredMockUserSchema = z.object({
	username: z.string().min(1),
	nickname: z.string(),
	bcryptHash: z.string().min(1),
});

type StoredMockUser = z.infer<typeof StoredMockUserSchema>;

// ─── Mock implementation (localStorage + bcrypt) ─────────────────────────────

const mockAuth: AuthService = {
	/**
	 * Mock mode has no server-side cookie session to re-hydrate from, so
	 * this just echoes back whatever `bp_user` is already cached — it
	 * exists purely so `mockAuth` satisfies the same `AuthService`
	 * interface as `apiAuth`.
	 */
	async me(): Promise<AuthResult> {
		try {
			const raw = localStorage.getItem("bp_user");
			if (!raw) return {success: false, message: "not_authenticated"};

			const parsed: unknown = JSON.parse(raw);
			if (
				parsed &&
				typeof parsed === "object" &&
				"username" in parsed &&
				typeof (parsed as {username: unknown}).username === "string"
			) {
				return {success: true, user: parsed as User};
			}
			return {success: false, message: "not_authenticated"};
		} catch {
			return {success: false, message: "not_authenticated"};
		}
	},

	async login(rawEmail: string, password: string): Promise<AuthResult> {
		const email = sanitizeEmail(rawEmail);
		if (!email || !password) {
			return {success: false, message: "fill_all_fields"};
		}

		try {
			const networkHash = hashPassword(password);
			await mockDelay();

			const stored = localStorage.getItem(`user_db_${email}`);
			if (!stored) return {success: false, message: "user_not_found"};

			// Zod-validate the raw localStorage value instead of a blind cast.
			const userResult = StoredMockUserSchema.safeParse(JSON.parse(stored));
			if (!userResult.success) {
				return {success: false, message: "user_data_error"};
			}
			const user: StoredMockUser = userResult.data;

			const ok = await compare(networkHash, user.bcryptHash);
			if (!ok) return {success: false, message: "wrong_password"};

			return {
				success: true,
				user: {username: user.username, nickname: user.nickname},
			};
		} catch (err) {
			logger.error("mockAuth.login failed", err, "authService");
			return {success: false, message: "internal_error"};
		}
	},

	async register(
		rawEmail: string,
		password: string,
		rawNickname: string,
	): Promise<AuthResult> {
		const email = sanitizeEmail(rawEmail);
		const nickname = rawNickname
			? sanitizeNickname(rawNickname)
			: (email.split("@")[0] ?? email);

		if (!email || !password) {
			return {success: false, message: "email_password_required"};
		}

		await mockDelay();

		if (localStorage.getItem(`user_db_${email}`)) {
			return {success: false, message: "email_taken"};
		}

		const networkHash = hashPassword(password);
		const salt = await genSalt(BCRYPT_ROUNDS);
		const bcryptHash = await hash(networkHash, salt);

		const record: StoredMockUser = {username: email, nickname, bcryptHash};
		localStorage.setItem(`user_db_${email}`, JSON.stringify(record));
		return {success: true, user: {username: email, nickname}};
	},

	async updateUser(username: string, updates: UpdateUserPayload): Promise<AuthResult> {
		await mockDelay();

		const raw = localStorage.getItem(`user_db_${username}`);
		if (!raw) return {success: false, message: "user_not_found_update"};

		// Zod-validate the raw localStorage value instead of a blind cast.
		const storedResult = StoredMockUserSchema.safeParse(JSON.parse(raw));
		if (!storedResult.success) {
			return {success: false, message: "update_data_error"};
		}
		const stored: StoredMockUser = storedResult.data;

		const patch: Partial<StoredMockUser> = {};
		if (updates.nickname !== undefined) {
			patch.nickname = sanitizeNickname(updates.nickname);
		}
		if (updates.password) {
			const salt = await genSalt(BCRYPT_ROUNDS);
			patch.bcryptHash = await hash(hashPassword(updates.password), salt);
		}

		const updated: StoredMockUser = {...stored, ...patch};
		localStorage.setItem(`user_db_${username}`, JSON.stringify(updated));
		return {
			success: true,
			user: {username: updated.username, nickname: updated.nickname},
		};
	},

	async forgotPassword(rawEmail: string): Promise<ForgotPasswordResponse> {
		const email = sanitizeEmail(rawEmail);
		if (!email) return {success: false, message: "invalid_email_auth"};

		await mockDelay();

		if (!localStorage.getItem(`user_db_${email}`)) {
			return {success: false, message: "account_not_found"};
		}

		const code = generateCode();
		const expiry = Date.now() + 15 * 60 * 1000;
		localStorage.setItem(`reset_${email}`, JSON.stringify({code, expiry}));

		const {sent, devCode} = await sendResetCode(email, code);
		return {success: true, email, sent, devCode};
	},

	async resetPassword(
		rawEmail: string,
		code: string,
		newPassword: string,
	): Promise<AuthResult> {
		const email = sanitizeEmail(rawEmail);
		await mockDelay();

		const raw = localStorage.getItem(`reset_${email}`);
		if (!raw) return {success: false, message: "code_not_found"};

		const parsed = ResetRecordSchema.safeParse(JSON.parse(raw));
		if (!parsed.success) return {success: false, message: "update_data_error"};

		const record = parsed.data;
		if (record.code !== code.trim()) return {success: false, message: "invalid_code"};
		if (Date.now() > record.expiry) {
			localStorage.removeItem(`reset_${email}`);
			return {success: false, message: "code_expired"};
		}

		const result = await mockAuth.updateUser(email, {password: newPassword});
		if (result.success) localStorage.removeItem(`reset_${email}`);
		return result;
	},

	// Mock mode has no server-side cookie to clear — nothing to do.
	async logout(): Promise<void> {},
};

// ─── Real API implementation (BookNest Spring Boot auth-service) ────────────
// Communicates over `authApi` (a separate Axios client pointed at
// config.AUTH_BASE_URL). The service issues JWTs as httpOnly cookies, so
// there is no bearer token to store client-side — `withCredentials: true`
// on `authApi` is all that is needed for the browser to attach/receive them.
// Every endpoint below is expected to reply with the same envelope shape as
// the mock implementation: `{success:true, user}` or `{success:false, message}`.

const apiAuth: AuthService = {
	async me(): Promise<AuthResult> {
		const {data} = await authApi.get<AuthResult>("/me");
		return data;
	},

	async login(email: string, password: string): Promise<AuthResult> {
		const guard = guardFormPayload({email, password});
		if (guard) return {success: false, message: "invalid_input"};
		const {data} = await authApi.post<AuthResult>("/login", {
			email: sanitizeEmail(email),
			password,
		});
		return data;
	},

	async register(
		email: string,
		password: string,
		nickname: string,
	): Promise<AuthResult> {
		const {data} = await authApi.post<AuthResult>("/register", {
			email: sanitizeEmail(email),
			password,
			name: nickname ? sanitizeNickname(nickname) : undefined,
		});
		return data;
	},

	async updateUser(username: string, updates: UpdateUserPayload): Promise<AuthResult> {
		const payload: Record<string, string> = {};
		if (updates.nickname !== undefined)
			payload["name"] = sanitizeNickname(updates.nickname);
		if (updates.password) payload["password"] = updates.password;
		const {data} = await authApi.put<AuthResult>("/me", payload);
		return data;
	},

	async forgotPassword(email: string): Promise<ForgotPasswordResponse> {
		// The auth-service only generates and stores the reset code — it
		// deliberately never sends email itself (see ForgotPasswordResponse's
		// Javadoc: `sent` is always false there). Actually emailing the code
		// is entirely the frontend's job, via EmailJS.
		const {data} = await authApi.post<ForgotPasswordResponse>("/forgot-password", {
			email: sanitizeEmail(email),
		});

		if (!data.success || !data.devCode) return data;

		const {sent, devCode} = await sendResetCode(
			data.email ?? sanitizeEmail(email),
			data.devCode,
		);
		return {...data, sent, devCode};
	},

	async resetPassword(
		email: string,
		code: string,
		newPassword: string,
	): Promise<AuthResult> {
		const {data} = await authApi.post<AuthResult>("/reset-password", {
			email: sanitizeEmail(email),
			code,
			newPassword,
		});
		return data;
	},

	async logout(): Promise<void> {
		try {
			await authApi.post("/logout");
		} catch (err) {
			// Best-effort — local state must still clear even if this fails
			// (server down, already-expired cookie, network blip, etc.).
			logger.error(
				"apiAuth.logout: server-side cookie clear failed",
				err,
				"authService",
			);
		}
	},
};

export const authService: AuthService = config.USE_MOCK ? mockAuth : apiAuth;
