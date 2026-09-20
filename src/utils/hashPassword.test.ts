import {describe, it, expect} from "vitest";
import {hashPassword} from "./hashPassword";

describe("hashPassword", () => {
	it("returns a 64-character hex string", () => {
		const hash = hashPassword("SecureP4ss");
		expect(hash).toHaveLength(64);
		expect(/^[0-9a-f]{64}$/.test(hash)).toBe(true);
	});

	it("is deterministic — same input always yields the same hash", () => {
		expect(hashPassword("Hello1")).toBe(hashPassword("Hello1"));
	});

	it("produces different hashes for different passwords", () => {
		expect(hashPassword("Hello1")).not.toBe(hashPassword("Hello2"));
	});

	it("handles an empty string without throwing", () => {
		expect(() => hashPassword("")).not.toThrow();
		expect(hashPassword("")).toHaveLength(64);
	});

	it("handles unicode characters without throwing", () => {
		expect(() => hashPassword("Пароль123")).not.toThrow();
	});
});
