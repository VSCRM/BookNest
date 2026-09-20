import {describe, it, expect, beforeEach, vi} from "vitest";
import {readLocalUser} from "./readLocalUser";
import {createSession} from "../security/sessionGuard";

beforeEach(() => {
	localStorage.clear();
	sessionStorage.clear();
});

describe("readLocalUser", () => {
	it("returns null when localStorage is empty", () => {
		expect(readLocalUser()).toBeNull();
	});

	it("returns null for invalid JSON in bp_user", () => {
		localStorage.setItem("bp_user", "NOT_JSON");
		expect(readLocalUser()).toBeNull();
	});

	it("returns null when the schema is invalid (extra key: bcryptHash)", () => {
		const evil = {username: "u@x.com", bcryptHash: "secret"};
		localStorage.setItem("bp_user", JSON.stringify(evil));
		createSession("u@x.com");
		expect(readLocalUser()).toBeNull();
	});

	it("returns null when the session cannot be verified", () => {
		localStorage.setItem("bp_user", JSON.stringify({username: "u@x.com"}));
		// No createSession → verifySession will return false
		expect(readLocalUser()).toBeNull();
	});

	it("removes the stale entry when validation fails", () => {
		localStorage.setItem(
			"bp_user",
			JSON.stringify({username: "u@x.com", bcryptHash: "x"}),
		);
		createSession("u@x.com");
		readLocalUser();
		expect(localStorage.getItem("bp_user")).toBeNull();
	});

	it("returns the validated user when storage and session are both valid", () => {
		const user = {username: "u@x.com", nickname: "Alice"};
		localStorage.setItem("bp_user", JSON.stringify(user));
		createSession("u@x.com");
		const result = readLocalUser();
		expect(result).not.toBeNull();
		expect(result?.username).toBe("u@x.com");
		expect(result?.nickname).toBe("Alice");
	});

	it("does not include extra keys in the returned object", () => {
		const user = {username: "u@x.com"};
		localStorage.setItem("bp_user", JSON.stringify(user));
		createSession("u@x.com");
		const result = readLocalUser();
		expect(result).not.toBeNull();
		expect(Object.keys(result ?? {})).not.toContain("bcryptHash");
	});
});
