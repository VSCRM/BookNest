import {describe, it, expect} from "vitest";
import {formatDate} from "./formatDate";

describe("formatDate", () => {
	it("returns a non-empty string for a valid ISO date", () => {
		const result = formatDate("2026-02-13");
		expect(typeof result).toBe("string");
		expect(result.length).toBeGreaterThan(0);
	});

	it("includes the year in the formatted output", () => {
		expect(formatDate("2026-02-13")).toContain("2026");
	});

	it("returns the raw input when the date is invalid", () => {
		expect(formatDate("not-a-date")).toBe("not-a-date");
	});

	it("capitalises the first letter", () => {
		const result = formatDate("2026-06-01");
		expect(result[0]).toBe(result[0]?.toUpperCase());
	});

	it("handles leap-year dates without error", () => {
		expect(() => formatDate("2024-02-29")).not.toThrow();
	});
});
