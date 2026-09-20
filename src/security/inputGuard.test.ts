import {describe, it, expect} from "vitest";
import {guardInput, guardFormPayload} from "./inputGuard";

describe("guardInput", () => {
	it("accepts normal text", () => {
		expect(guardInput("hello world", "email").ok).toBe(true);
	});

	it("rejects a <script> tag", () => {
		const result = guardInput("<script>alert(1)</script>", "field");
		expect(result.ok).toBe(false);
		expect(result.reason).toContain("field");
	});

	it("rejects a javascript: URI", () => {
		expect(guardInput("javascript:alert(1)", "link").ok).toBe(false);
	});

	it("rejects an inline event handler", () => {
		expect(guardInput("onerror=alert(1)", "input").ok).toBe(false);
	});

	it("rejects SQL UNION SELECT", () => {
		expect(guardInput("' UNION SELECT * FROM users", "q").ok).toBe(false);
	});

	it("rejects DROP TABLE", () => {
		expect(guardInput("; DROP TABLE users", "q").ok).toBe(false);
	});

	it("rejects a payload that exceeds 4096 bytes", () => {
		const big = "A".repeat(5000);
		expect(guardInput(big, "field").ok).toBe(false);
	});
});

describe("guardFormPayload", () => {
	it("returns null when all fields are clean", () => {
		expect(
			guardFormPayload({email: "user@example.com", password: "Hello1!"}),
		).toBeNull();
	});

	it("returns the offending field reason", () => {
		const result = guardFormPayload({email: "<script>xss</script>"});
		expect(result).toContain("email");
	});
});
