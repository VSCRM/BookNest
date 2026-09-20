import {describe, it, expect, beforeEach} from "vitest";
import {getCsrfToken, clearCsrfToken} from "./csrf";

beforeEach(() => clearCsrfToken());

describe("getCsrfToken", () => {
	it("returns a 64-character hex string", () => {
		const token = getCsrfToken();
		expect(token).toMatch(/^[0-9a-f]{64}$/);
	});

	it("returns the same token on subsequent calls within a session", () => {
		const a = getCsrfToken();
		const b = getCsrfToken();
		expect(a).toBe(b);
	});

	it("generates a new token after clearCsrfToken()", () => {
		const first = getCsrfToken();
		clearCsrfToken();
		const second = getCsrfToken();
		expect(first).not.toBe(second);
	});
});
