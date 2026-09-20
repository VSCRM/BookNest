/**
 * Input guard — last line of defence before data leaves the client.
 *
 * Complements the Zod schema validation (runtime types) and the
 * sanitize utils (whitespace / HTML stripping) with:
 *   • Payload size limits (prevents large-payload DoS against the API)
 *   • Dangerous-pattern detection (SQLi, script injection probes)
 *
 * This is defence-in-depth: the backend MUST also validate independently.
 */

/** Maximum allowed byte-length for text fields sent to the API. */
const MAX_PAYLOAD_BYTES = 4096;

/** Patterns that indicate attempted injection attacks. */
const DANGEROUS_PATTERNS: readonly RegExp[] = [
	/<\s*script/i, // XSS — script tag
	/javascript\s*:/i, // XSS — javascript: URI
	/on\w+\s*=/i, // XSS — inline event handler
	/'\s*(or|and)\s*'?\d/i, // SQLi — OR/AND condition
	/;\s*drop\s+table/i, // SQLi — DROP TABLE
	/union\s+select/i, // SQLi — UNION SELECT
];

export interface InputGuardResult {
	ok: boolean;
	reason: string | null;
}

/**
 * Validates a string payload before it is sent to the backend.
 *
 * @param value - The raw input string.
 * @param fieldName - Used in the error reason for diagnostics.
 */
export function guardInput(value: string, fieldName = "field"): InputGuardResult {
	if (new TextEncoder().encode(value).length > MAX_PAYLOAD_BYTES) {
		return {ok: false, reason: `${fieldName}: payload too large`};
	}
	for (const pattern of DANGEROUS_PATTERNS) {
		if (pattern.test(value)) {
			return {ok: false, reason: `${fieldName}: potentially dangerous content`};
		}
	}
	return {
		ok: true,
		reason: null,
	};
}

/**
 * Guards an entire form payload object.
 * Returns the first failing field's reason, or null when all fields pass.
 */
export function guardFormPayload(payload: Record<string, string>): string | null {
	for (const [field, value] of Object.entries(payload)) {
		const result = guardInput(value, field);
		if (!result.ok) return result.reason;
	}
	return null;
}
