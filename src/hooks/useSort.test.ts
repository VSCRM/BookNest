import {describe, it, expect} from "vitest";
import {renderHook, act} from "@testing-library/react";
import {useSort} from "./useSort";
import type {Book} from "../schemas";

const makeBook = (id: number, publishedYear: number): Book => ({
	id,
	title: `Book ${id}`,
	author: "Test Author",
	genre: "Фентезі",
	price: 100,
	publishedYear,
});

const books: Book[] = [makeBook(1, 2010), makeBook(2, 2015), makeBook(3, 2005)];

describe("useSort", () => {
	it("starts with descending order by default", () => {
		const {result} = renderHook(() => useSort(books, "publishedYear"));
		expect(result.current.order).toBe("desc");
	});

	it('sorts books newest-first when order is "desc"', () => {
		const {result} = renderHook(() => useSort(books, "publishedYear"));
		const years = result.current.sorted.map((b) => b.publishedYear);
		expect(years[0]).toBe(2015);
		expect(years[years.length - 1]).toBe(2005);
	});

	it('sorts books oldest-first after toggling to "asc"', () => {
		const {result} = renderHook(() => useSort(books, "publishedYear"));
		act(() => result.current.toggleOrder());
		expect(result.current.order).toBe("asc");
		const years = result.current.sorted.map((b) => b.publishedYear);
		expect(years[0]).toBe(2005);
		expect(years[years.length - 1]).toBe(2015);
	});

	it('toggles back to "desc" on a second call', () => {
		const {result} = renderHook(() => useSort(books, "publishedYear"));
		act(() => result.current.toggleOrder());
		act(() => result.current.toggleOrder());
		expect(result.current.order).toBe("desc");
	});

	it("does not mutate the original input array", () => {
		const copy = [...books];
		renderHook(() => useSort(books, "publishedYear"));
		expect(books).toEqual(copy);
	});

	it("returns an empty array for empty input", () => {
		const {result} = renderHook(() => useSort([]));
		expect(result.current.sorted).toEqual([]);
	});
});
