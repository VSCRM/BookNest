import {describe, it, expect} from "vitest";
import {filterByGenre} from "./homeHelpers";
import type {Book} from "../../schemas";

const makeBook = (id: number, genre: string): Book => ({
	id,
	title: `Book ${id}`,
	author: "Test Author",
	genre,
	price: 100,
});

const books: Book[] = [
	makeBook(1, "Фентезі"),
	makeBook(2, "Детектив"),
	makeBook(3, "Фентезі"),
	makeBook(4, "Наукова фантастика"),
];

describe("filterByGenre", () => {
	it('returns all books when genre is "Всі"', () => {
		expect(filterByGenre(books, "Всі")).toHaveLength(4);
	});

	it("filters correctly by a specific genre", () => {
		const result = filterByGenre(books, "Фентезі");
		expect(result).toHaveLength(2);
		result.forEach((b) => expect(b.genre).toBe("Фентезі"));
	});

	it("returns an empty array when no books match", () => {
		expect(filterByGenre(books, "Поезія")).toHaveLength(0);
	});

	it("handles an empty input array", () => {
		expect(filterByGenre([], "Фентезі")).toHaveLength(0);
	});

	it("does not mutate the original array", () => {
		const copy = [...books];
		filterByGenre(books, "Детектив");
		expect(books).toEqual(copy);
	});

	it('respects the locale when resolving the "All" sentinel', () => {
		expect(filterByGenre(books, "All", "en")).toHaveLength(4);
	});
});
