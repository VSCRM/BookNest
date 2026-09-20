import {describe, it, expect, vi, beforeEach} from "vitest";
import {renderHook, act} from "@testing-library/react";
import {useBookActions} from "./useBookActions";
import type {Book, User} from "../schemas";

const mockBook: Book = {
	id: 1,
	title: "Test Book",
	author: "Test Author",
	genre: "Фентезі",
	price: 199,
};

const mockUser: User = {username: "u@x.com", nickname: "Alice"};

describe("useBookActions", () => {
	beforeEach(() => {
		vi.restoreAllMocks();
		localStorage.clear();
	});

	it('saveBook returns "redirect" when user is null', () => {
		const setSavedBooks = vi.fn();
		const {result} = renderHook(() => useBookActions(null, setSavedBooks));
		expect(result.current.saveBook(mockBook)).toBe("redirect");
		expect(setSavedBooks).not.toHaveBeenCalled();
	});

	it('saveBook returns "saved" and updates state when user is logged in', () => {
		const setSavedBooks = vi.fn();
		const {result} = renderHook(() => useBookActions(mockUser, setSavedBooks));
		let actionResult: "saved" | "redirect" = "redirect";
		act(() => {
			actionResult = result.current.saveBook(mockBook);
		});
		expect(actionResult).toBe("saved");
		expect(setSavedBooks).toHaveBeenCalled();
	});

	it("saveBook does not add a duplicate book", () => {
		const setSavedBooks = vi.fn();
		const {result} = renderHook(() => useBookActions(mockUser, setSavedBooks));

		act(() => {
			result.current.saveBook(mockBook);
		});
		// Simulate the setter being called with the updater function:
		const updater = setSavedBooks.mock.calls[0]?.[0] as (prev: Book[]) => Book[];
		// Already contains the book — should NOT duplicate it.
		const existing = [mockBook];
		const updated = updater(existing);
		expect(updated).toHaveLength(1);
	});

	it("unsaveBook filters out the book by id", () => {
		const setSavedBooks = vi.fn();
		const {result} = renderHook(() => useBookActions(mockUser, setSavedBooks));

		act(() => {
			result.current.unsaveBook(mockBook.id);
		});
		expect(setSavedBooks).toHaveBeenCalled();

		const updater = setSavedBooks.mock.calls[0]?.[0] as (prev: Book[]) => Book[];
		const remaining = updater([mockBook]);
		expect(remaining).toHaveLength(0);
	});

	it("unsaveBook leaves other books untouched", () => {
		const secondBook: Book = {...mockBook, id: 2, title: "Second"};
		const setSavedBooks = vi.fn();
		const {result} = renderHook(() => useBookActions(mockUser, setSavedBooks));

		act(() => {
			result.current.unsaveBook(1);
		});

		const updater = setSavedBooks.mock.calls[0]?.[0] as (prev: Book[]) => Book[];
		const remaining = updater([mockBook, secondBook]);
		expect(remaining).toHaveLength(1);
		expect(remaining[0]?.id).toBe(2);
	});
});
