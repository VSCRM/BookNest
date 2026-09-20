import {describe, it, expect, beforeEach, vi} from "vitest";
import {
	checkRateLimit,
	recordFailedAttempt,
	clearRateLimit,
	getRemainingAttempts,
} from "./rateLimiter";

const USERNAME = "test@example.com";
const RL_KEY = `bp_rl_${USERNAME}`;

beforeEach(() => {
	localStorage.clear();
	vi.restoreAllMocks();
});

describe("checkRateLimit", () => {
	it("returns null when no record exists (user is not blocked)", () => {
		expect(checkRateLimit(USERNAME)).toBeNull();
	});

	it("returns null when attempts are below the threshold", () => {
		localStorage.setItem(RL_KEY, JSON.stringify({attempts: 3, blockedUntil: 0}));
		expect(checkRateLimit(USERNAME)).toBeNull();
	});

	it("returns a rate_limit:<minutes> code when the user is currently blocked", () => {
		const future = Date.now() + 10 * 60 * 1000;
		localStorage.setItem(RL_KEY, JSON.stringify({attempts: 5, blockedUntil: future}));
		const result = checkRateLimit(USERNAME);
		expect(result).not.toBeNull();
		expect(typeof result).toBe("string");
		// Returns a structured code that form hooks translate via resolveAuthError.
		expect(result).toMatch(/^rate_limit:\d+$/);
	});

	it("auto-resets the record when an expired block is found", () => {
		const past = Date.now() - 1000;
		localStorage.setItem(RL_KEY, JSON.stringify({attempts: 5, blockedUntil: past}));
		const result = checkRateLimit(USERNAME);
		expect(result).toBeNull();
		const stored = JSON.parse(localStorage.getItem(RL_KEY) ?? "{}") as {
			attempts: number;
		};
		expect(stored.attempts).toBe(0);
	});

	it("returns null when localStorage contains corrupted JSON", () => {
		localStorage.setItem(RL_KEY, "NOT_JSON");
		expect(checkRateLimit(USERNAME)).toBeNull();
	});

	it("returns null when localStorage contains an invalid schema", () => {
		localStorage.setItem(RL_KEY, JSON.stringify({foo: "bar"}));
		expect(checkRateLimit(USERNAME)).toBeNull();
	});
});

describe("recordFailedAttempt", () => {
	it("increments the attempt counter", () => {
		recordFailedAttempt(USERNAME);
		const stored = JSON.parse(localStorage.getItem(RL_KEY) ?? "{}") as {
			attempts: number;
		};
		expect(stored.attempts).toBe(1);
	});

	it("sets a blockedUntil timestamp after 5 attempts", () => {
		for (let i = 0; i < 5; i++) recordFailedAttempt(USERNAME);
		const stored = JSON.parse(localStorage.getItem(RL_KEY) ?? "{}") as {
			blockedUntil: number;
		};
		expect(stored.blockedUntil).toBeGreaterThan(Date.now());
	});

	it("does not block after fewer than 5 attempts", () => {
		for (let i = 0; i < 4; i++) recordFailedAttempt(USERNAME);
		const stored = JSON.parse(localStorage.getItem(RL_KEY) ?? "{}") as {
			blockedUntil: number;
		};
		expect(stored.blockedUntil).toBe(0);
	});
});

describe("clearRateLimit", () => {
	it("removes the rate-limit record from localStorage", () => {
		localStorage.setItem(RL_KEY, JSON.stringify({attempts: 3, blockedUntil: 0}));
		clearRateLimit(USERNAME);
		expect(localStorage.getItem(RL_KEY)).toBeNull();
	});

	it("is a no-op when no record exists", () => {
		expect(() => clearRateLimit(USERNAME)).not.toThrow();
	});
});

describe("getRemainingAttempts", () => {
	it("returns 5 when no attempts have been recorded", () => {
		expect(getRemainingAttempts(USERNAME)).toBe(5);
	});

	it("decrements correctly as attempts accumulate", () => {
		for (let i = 0; i < 3; i++) recordFailedAttempt(USERNAME);
		expect(getRemainingAttempts(USERNAME)).toBe(2);
	});

	it("returns 0 when the user is currently blocked", () => {
		const future = Date.now() + 10 * 60 * 1000;
		localStorage.setItem(RL_KEY, JSON.stringify({attempts: 5, blockedUntil: future}));
		expect(getRemainingAttempts(USERNAME)).toBe(0);
	});
});
