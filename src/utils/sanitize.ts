/**
 * Input sanitisation utilities.
 * All functions are pure and free of side-effects so they can be
 * safely imported in both browser and test (jsdom) environments.
 */

export const FIELD_LIMITS = {
	email: 254,
	nickname: 32,
	password: 128,
	search: 200,
} as const;

/**
 * Strips control characters, HTML tags, and dangerous URI schemes from a
 * string and truncates it to `maxLength` code-points.
 */
export function sanitizeText(value: unknown, maxLength: number = 200): string {
	if (typeof value !== "string") return "";

	const stripped = Array.from(value.trim().slice(0, maxLength))
		.filter((ch) => {
			const c = ch.charCodeAt(0);
			return !(c <= 8 || c === 11 || c === 12 || (c >= 14 && c <= 31) || c === 127);
		})
		.join("");

	return stripped
		.replace(/<[^>]*>/g, "")
		.replace(/javascript\s*:/gi, "")
		.replace(/data\s*:/gi, "");
}

/** Normalises an email address (lowercase + trim). */
export function sanitizeEmail(value: string): string {
	return sanitizeText(value, FIELD_LIMITS.email).toLowerCase().trim();
}

/**
 * Strips characters that are not alphanumeric, spaces, hyphens,
 * underscores, or Ukrainian/Cyrillic letters from a nickname.
 */
export function sanitizeNickname(value: string): string {
	return sanitizeText(value, FIELD_LIMITS.nickname).replace(
		/[^a-zA-Z0-9 _\-а-яА-ЯіІїЇєЄ]/g,
		"",
	);
}

/** Sanitises a free-text search query. */
export function sanitizeSearchQuery(value: string): string {
	return sanitizeText(value, FIELD_LIMITS.search);
}

/** Returns a JSON string or `null` when serialisation fails (e.g. circular refs). */
export function safeStringify(data: unknown): string | null {
	try {
		return JSON.stringify(data);
	} catch {
		return null;
	}
}

/** Parses a JSON string and returns the value, or `null` on any error. */
export function safeParse(raw: unknown): unknown {
	if (!raw || typeof raw !== "string") return null;
	try {
		return JSON.parse(raw);
	} catch {
		return null;
	}
}

/**
 * Validates that an object has the exact shape allowed for the stored
 * user object (`{ username, nickname? }` — no extra keys).
 * Returns a type-narrowed result so callers can avoid an `as` cast.
 */
export function isValidUserShape(
	user: unknown,
): user is {username: string; nickname?: string} {
	if (!user || typeof user !== "object" || Array.isArray(user)) return false;
	const record = user as Record<string, unknown>;
	if (typeof record["username"] !== "string") return false;
	const {username} = record as {username: string};
	if (username.length < 1 || username.length > FIELD_LIMITS.email) return false;
	const allowed = new Set<string>(["username", "nickname"]);
	return Object.keys(record).every((k) => allowed.has(k));
}
