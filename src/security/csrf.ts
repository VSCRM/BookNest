/**
 * CSRF protection for state-mutating API requests.
 *
 * Strategy: Double-Submit Cookie pattern.
 * 1. On app init, generate a random token and store it in sessionStorage.
 * 2. Attach it as a custom request header (X-CSRF-Token) on every
 *    non-safe HTTP method (POST, PUT, PATCH, DELETE).
 * 3. The backend validates the header matches the session.
 *
 * Why sessionStorage (not cookie)?
 * ─────────────────────────────────
 * sessionStorage is not sent automatically by the browser, so it is immune
 * to cross-site request forgery by design.  Cookies with SameSite=Strict
 * would also work but require server cooperation.
 *
 * Note: This implementation covers the frontend side.  The backend must also
 * validate the header.
 */

const CSRF_KEY = "bp_csrf_token";

/** Generates a cryptographically random 32-byte hex token. */
function generateToken(): string {
	const bytes = new Uint8Array(32);
	crypto.getRandomValues(bytes);
	return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Returns the current CSRF token, creating one if it does not exist.
 * Call this once on app startup to guarantee the token exists.
 */
export function getCsrfToken(): string {
	try {
		const existing = sessionStorage.getItem(CSRF_KEY);
		if (existing) return existing;
		const token = generateToken();
		sessionStorage.setItem(CSRF_KEY, token);
		return token;
	} catch {
		// sessionStorage blocked (e.g. strict private browsing) — fall back to
		// a per-request token that provides partial protection.
		return generateToken();
	}
}

/** Clears the CSRF token on logout (forces a new token on next session). */
export function clearCsrfToken(): void {
	try {
		sessionStorage.removeItem(CSRF_KEY);
	} catch {
		/* ignore */
	}
}
