import {describe, it, expect} from "vitest";
import {
	sanitizeText,
	sanitizeEmail,
	sanitizeNickname,
	sanitizeSearchQuery,
	safeStringify,
	safeParse,
	isValidUserShape,
	FIELD_LIMITS,
} from "./sanitize";

describe("sanitizeText", () => {
	it("returns an empty string for non-string input", () => {
		expect(sanitizeText(null)).toBe("");
		expect(sanitizeText(undefined)).toBe("");
		expect(sanitizeText(42)).toBe("");
		expect(sanitizeText({})).toBe("");
	});

	it("strips HTML tags but leaves inner text content", () => {
		// The regex removes tag wrappers only — inner text is preserved.
		expect(sanitizeText("<script>alert(1)</script>hello")).toBe("alert(1)hello");
		expect(sanitizeText("<b>bold</b>")).toBe("bold");
	});

	it("strips javascript: URI scheme", () => {
		expect(sanitizeText("javascript:alert(1)")).not.toContain("javascript:");
	});

	it("strips data: URI scheme", () => {
		expect(sanitizeText("data:text/html,<h1>test</h1>")).not.toContain("data:");
	});

	it("strips control characters", () => {
		expect(sanitizeText("hello\x00world")).toBe("helloworld");
		expect(sanitizeText("test\x1Fvalue")).toBe("testvalue");
	});

	it("trims leading and trailing whitespace", () => {
		expect(sanitizeText("  hello  ")).toBe("hello");
	});

	it("truncates to maxLength code-points", () => {
		const long = "a".repeat(300);
		expect(sanitizeText(long, 100)).toHaveLength(100);
	});

	it("applies the default maxLength of 200", () => {
		const long = "x".repeat(250);
		expect(sanitizeText(long)).toHaveLength(200);
	});
});

describe("sanitizeEmail", () => {
	it("lowercases the email", () => {
		expect(sanitizeEmail("USER@EXAMPLE.COM")).toBe("user@example.com");
	});

	it("trims whitespace", () => {
		expect(sanitizeEmail("  user@example.com  ")).toBe("user@example.com");
	});

	it("respects the email length limit", () => {
		const long = `${"a".repeat(260)}@example.com`;
		expect(sanitizeEmail(long).length).toBeLessThanOrEqual(FIELD_LIMITS.email);
	});
});

describe("sanitizeNickname", () => {
	it("allows letters, digits, spaces, hyphens, underscores", () => {
		expect(sanitizeNickname("Alice_123")).toBe("Alice_123");
		expect(sanitizeNickname("user-name 42")).toBe("user-name 42");
	});

	it("strips HTML tags and special characters from a nickname", () => {
		// <script> tag is removed; ! is filtered by the charset regex → 'Alice'
		expect(sanitizeNickname("Alice<script>!")).toBe("Alice");
		// Chars outside the allowed set are stripped
		expect(sanitizeNickname("Alice@#$")).toBe("Alice");
	});

	it("allows Cyrillic / Ukrainian letters", () => {
		expect(sanitizeNickname("Іван")).toBe("Іван");
	});

	it("respects the nickname length limit", () => {
		expect(sanitizeNickname("a".repeat(50)).length).toBeLessThanOrEqual(
			FIELD_LIMITS.nickname,
		);
	});
});

describe("sanitizeSearchQuery", () => {
	it("strips HTML from search queries", () => {
		expect(sanitizeSearchQuery("<b>news</b>")).toBe("news");
	});

	it("respects the search length limit", () => {
		expect(sanitizeSearchQuery("x".repeat(300)).length).toBeLessThanOrEqual(
			FIELD_LIMITS.search,
		);
	});
});

describe("safeStringify", () => {
	it("serialises a plain object to JSON", () => {
		expect(safeStringify({a: 1})).toBe('{"a":1}');
	});

	it("returns null for circular references", () => {
		const obj: Record<string, unknown> = {};
		obj["self"] = obj;
		expect(safeStringify(obj)).toBeNull();
	});

	it("serialises null", () => {
		expect(safeStringify(null)).toBe("null");
	});
});

describe("safeParse", () => {
	it("parses valid JSON", () => {
		expect(safeParse('{"a":1}')).toEqual({a: 1});
	});

	it("returns null for invalid JSON", () => {
		expect(safeParse("not-json")).toBeNull();
	});

	it("returns null for non-string / empty input", () => {
		expect(safeParse(null)).toBeNull();
		expect(safeParse(undefined)).toBeNull();
		expect(safeParse("")).toBeNull();
		expect(safeParse(42)).toBeNull();
	});
});

describe("isValidUserShape", () => {
	it("returns true for a minimal valid user", () => {
		expect(isValidUserShape({username: "u@x.com"})).toBe(true);
	});

	it("returns true for a user with an optional nickname", () => {
		expect(isValidUserShape({username: "u@x.com", nickname: "Alice"})).toBe(true);
	});

	it("returns false for extra keys (e.g. bcryptHash)", () => {
		expect(isValidUserShape({username: "u@x.com", bcryptHash: "secret"})).toBe(false);
	});

	it("returns false when username is missing", () => {
		expect(isValidUserShape({nickname: "Alice"})).toBe(false);
	});

	it("returns false for null / non-object input", () => {
		expect(isValidUserShape(null)).toBe(false);
		expect(isValidUserShape("string")).toBe(false);
		expect(isValidUserShape([])).toBe(false);
	});

	it("returns false when username is an empty string", () => {
		expect(isValidUserShape({username: ""})).toBe(false);
	});

	it("returns false when username exceeds the email length limit", () => {
		expect(isValidUserShape({username: "a".repeat(FIELD_LIMITS.email + 1)})).toBe(
			false,
		);
	});
});
