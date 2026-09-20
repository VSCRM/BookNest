/**
 * Translates an authService / rateLimiter error code into the active-locale
 * message string.
 *
 * Error codes are plain keys like 'user_not_found' or structured like
 * 'rate_limit:5' (for rate-limit blocks with a dynamic minutes value).
 *
 * @param code - The raw error code returned by authService or rateLimiter.
 * @param t    - The active translation dictionary from useLocale().
 * @returns    Translated human-readable string, or the raw code as fallback.
 */
import type {en} from "../i18n/translations";

export function resolveAuthError(code: string, t: typeof en): string {
	if (code.startsWith("rate_limit:")) {
		const minutes = parseInt(code.slice("rate_limit:".length), 10);
		return t.auth.tooManyAttempts(isNaN(minutes) ? 1 : minutes);
	}
	const authMap = t.auth as Record<string, unknown>;
	const msg = authMap[code];
	return typeof msg === "string" ? msg : code;
}
