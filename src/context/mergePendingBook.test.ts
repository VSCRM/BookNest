import {describe, it, expect, vi, beforeEach} from "vitest";
import type {Book} from "../schemas";

const saveMock = vi.fn().mockResolvedValue(undefined);

vi.mock("../services/savedBooksService", () => ({
	savedBooksService: {
		save: (...args: unknown[]) => saveMock(...args),
	},
}));

vi.mock("../config", () => ({
	default: {USE_MOCK: false},
}));

import {mergePendingBook} from "./mergePendingBook";
import {PENDING_SAVE_KEY} from "../hooks/useSaveBook";

const bookA: Book = {id: 1, title: "A", author: "Author", genre: "Фентезі", price: 100};
const bookB: Book = {id: 2, title: "B", author: "Author", genre: "Фентезі", price: 150};

describe("mergePendingBook", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		sessionStorage.clear();
	});

	it("returns `existing` unchanged when nothing is pending", () => {
		const result = mergePendingBook("u@x.com", [bookA]);
		expect(result).toEqual([bookA]);
		expect(saveMock).not.toHaveBeenCalled();
	});

	it("appends the pending book and persists it server-side", () => {
		sessionStorage.setItem(PENDING_SAVE_KEY, JSON.stringify(bookB));

		const result = mergePendingBook("u@x.com", [bookA]);

		expect(result).toEqual([bookA, bookB]);
		expect(saveMock).toHaveBeenCalledWith("u@x.com", bookB);
		// Must be consumed exactly once — a second call shouldn't re-add it.
		expect(sessionStorage.getItem(PENDING_SAVE_KEY)).toBeNull();
	});

	it("does not duplicate a pending book already present in `existing`", () => {
		sessionStorage.setItem(PENDING_SAVE_KEY, JSON.stringify(bookA));

		const result = mergePendingBook("u@x.com", [bookA]);

		expect(result).toEqual([bookA]);
		expect(saveMock).not.toHaveBeenCalled();
	});
});
