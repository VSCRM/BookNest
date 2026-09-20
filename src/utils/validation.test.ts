/**
 * Unit tests for all pure validator functions in utils/validation.ts.
 *
 * All validators now return translation *keys* (e.g. 'required', 'minPassword')
 * rather than human-readable strings, so assertions check key values directly.
 */

import {describe, it, expect} from "vitest";
import {
	validateEmail,
	validateNickname,
	validatePassword,
	validatePasswordOptional,
	getPasswordStrength,
	VALIDATORS,
} from "./validation";

// ─── validateEmail ────────────────────────────────────────────────────────────

describe("validateEmail", () => {
	it("returns empty string for a valid email", () => {
		expect(validateEmail("user@example.com")).toBe("");
		expect(validateEmail("a+tag@sub.domain.org")).toBe("");
	});

	it('returns "required" key for an empty string', () => {
		expect(validateEmail("")).toBe("required");
	});

	it('returns "invalidEmail" key for a missing @ symbol', () => {
		// Use a clearly intentional invalid value
		expect(validateEmail("not-valid-email")).toBe("invalidEmail");
	});

	it('returns "invalidEmail" key for a missing domain', () => {
		expect(validateEmail("user@")).toBe("invalidEmail");
	});

	it('returns "emailTooLong" key for an email exceeding 254 characters', () => {
		const long = `${"a".repeat(250)}@x.com`;
		expect(validateEmail(long)).toBe("emailTooLong");
	});
});

// ─── validateNickname ─────────────────────────────────────────────────────────

describe("validateNickname", () => {
	it("returns empty string for a valid nickname", () => {
		expect(validateNickname("Alice")).toBe("");
		expect(validateNickname("Jo")).toBe("");
	});

	it('returns "required" key for an empty string', () => {
		expect(validateNickname("")).toBe("required");
	});

	it('returns "minNickname" key for a single character', () => {
		expect(validateNickname("A")).toBe("minNickname");
	});

	it('returns "maxNickname" key for a nickname exceeding 32 characters', () => {
		expect(validateNickname("a".repeat(33))).toBe("maxNickname");
	});
});

// ─── validatePassword ─────────────────────────────────────────────────────────

describe("validatePassword", () => {
	it("returns empty string for a strong password", () => {
		expect(validatePassword("SecureP4ss")).toBe("");
		expect(validatePassword("Hello1")).toBe("");
	});

	it('returns "required" key for an empty password', () => {
		expect(validatePassword("")).toBe("required");
	});

	it('returns "minPassword" key for a password shorter than 6 characters', () => {
		expect(validatePassword("Ab1")).toBe("minPassword");
	});

	it('returns "passwordUpper" key when no uppercase letter is present', () => {
		// lowercase + digit, no uppercase
		expect(validatePassword("lowercase9")).toBe("passwordUpper");
	});

	it('returns "passwordDigit" key when no digit is present', () => {
		expect(validatePassword("AllLetters")).toBe("passwordDigit");
	});

	it('returns "latinOnly" key for non-ASCII (Cyrillic) characters', () => {
		expect(validatePassword("Пароль1")).toBe("latinOnly");
	});
});

// ─── validatePasswordOptional ─────────────────────────────────────────────────

describe("validatePasswordOptional", () => {
	it("returns empty string for an empty value (field is optional)", () => {
		expect(validatePasswordOptional("")).toBe("");
	});

	it("applies the same rules as validatePassword when a value is provided", () => {
		expect(validatePasswordOptional("weak")).not.toBe("");
		expect(validatePasswordOptional("SecureP4ss")).toBe("");
	});
});

// ─── getPasswordStrength ──────────────────────────────────────────────────────

describe("getPasswordStrength", () => {
	it("returns null for an empty string", () => {
		expect(getPasswordStrength("")).toBeNull();
	});

	it('returns "weak" for a short password', () => {
		// Use assertNonNull pattern to satisfy strictNullChecks
		const result = getPasswordStrength("ab");
		expect(result).not.toBeNull();
		expect(result!.level).toBe("weak");
	});

	it('returns "weak" for a Cyrillic password', () => {
		const result = getPasswordStrength("Пароль");
		expect(result).not.toBeNull();
		expect(result!.level).toBe("weak");
	});

	it('returns "medium" for a moderately strong password', () => {
		const result = getPasswordStrength("Hello1");
		expect(result).not.toBeNull();
		expect(result!.level).toBe("medium");
	});

	it('returns "strong" for a long password with symbols', () => {
		const result = getPasswordStrength("Str0ng!Pass");
		expect(result).not.toBeNull();
		expect(result!.level).toBe("strong");
	});

	it("includes a labelKey that is a string", () => {
		const result = getPasswordStrength("Hello1");
		expect(result).not.toBeNull();
		expect(typeof result!.labelKey).toBe("string");
		expect(result!.labelKey).toBeTruthy();
	});
});

// ─── VALIDATORS lookup table ──────────────────────────────────────────────────

describe("VALIDATORS lookup table", () => {
	it("contains entries for email, nickname, and password", () => {
		expect(typeof VALIDATORS["email"]).toBe("function");
		expect(typeof VALIDATORS["nickname"]).toBe("function");
		expect(typeof VALIDATORS["password"]).toBe("function");
	});

	it("delegates correctly to the underlying validators", () => {
		expect(VALIDATORS["email"]!("good@example.com")).toBe("");
		expect(VALIDATORS["email"]!("bad-value")).not.toBe("");
		expect(VALIDATORS["password"]!("Secure1")).toBe("");
		expect(VALIDATORS["password"]!("weak")).not.toBe("");
	});
});
