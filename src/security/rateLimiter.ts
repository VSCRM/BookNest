import {RateLimitRecordSchema, type RateLimitRecord} from "../schemas";

/** Maximum allowed consecutive failed login attempts before a lockout. */
const MAX_ATTEMPTS = 5;
/** Duration of a lockout in milliseconds (15 minutes). */
const BLOCK_DURATION_MS = 15 * 60 * 1000;

function getKey(username: string): string {
	return `bp_rl_${username}`;
}

/** Reads and validates the rate-limit record from localStorage. */
function getRecord(username: string): RateLimitRecord {
	const defaultRecord: RateLimitRecord = {attempts: 0, blockedUntil: 0};
	try {
		const raw = localStorage.getItem(getKey(username));
		if (!raw) return defaultRecord;
		const parsed: unknown = JSON.parse(raw);
		const result = RateLimitRecordSchema.safeParse(parsed);
		return result.success ? result.data : defaultRecord;
	} catch {
		return defaultRecord;
	}
}

function saveRecord(username: string, record: RateLimitRecord): void {
	try {
		localStorage.setItem(getKey(username), JSON.stringify(record));
	} catch {
		// Storage quota exceeded — silently ignore.
	}
}

/**
 * Checks whether the given username is currently rate-limited.
 *
 * @returns A localised lockout message string when blocked, or `null` when allowed.
 */
export function checkRateLimit(username: string): string | null {
	const record = getRecord(username);
	const now = Date.now();

	if (record.blockedUntil > now) {
		const remainingMs = record.blockedUntil - now;
		const minutes = Math.ceil(remainingMs / 60_000);
		// Structured code — form hooks decode and translate: 'rate_limit:<minutes>'
		return `rate_limit:${minutes}`;
	}

	// Block expired — reset the counter automatically.
	if (record.blockedUntil > 0 && record.blockedUntil <= now) {
		saveRecord(username, {attempts: 0, blockedUntil: 0});
	}

	return null;
}

/** Records one more failed login attempt; locks the account when the limit is reached. */
export function recordFailedAttempt(username: string): void {
	const record = getRecord(username);
	const attempts = record.attempts + 1;

	if (attempts >= MAX_ATTEMPTS) {
		saveRecord(username, {
			attempts,
			blockedUntil: Date.now() + BLOCK_DURATION_MS,
		});
	} else {
		saveRecord(username, {attempts, blockedUntil: 0});
	}
}

/** Clears the rate-limit record after a successful login. */
export function clearRateLimit(username: string): void {
	try {
		localStorage.removeItem(getKey(username));
	} catch {
		// Silently ignore.
	}
}

/**
 * Returns how many more failed attempts the user has before being locked out.
 * Returns 0 when already locked out.
 */
export function getRemainingAttempts(username: string): number {
	const record = getRecord(username);
	if (record.blockedUntil > Date.now()) return 0;
	return Math.max(0, MAX_ATTEMPTS - record.attempts);
}
