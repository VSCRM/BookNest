/**
 * Book filter hook: text query + author.
 *
 * React 19 / useTransition
 * ────────────────────────
 * Filter computation runs inside `startTransition` so it is treated as a
 * non-urgent update.  The UI stays responsive while a large book list is
 * being filtered — React can interrupt and re-schedule the work if the user
 * keeps typing.
 */
import {useState, useTransition, useMemo} from "react";
import type {Book} from "../schemas";

interface UseSearchResult {
	results: Book[];
	query: string;
	author: string;
	date: string;
	isPending: boolean;
	setQuery: (value: string) => void;
	setAuthor: (value: string) => void;
	setDate: (value: string) => void;
	clearFilters: () => void;
}

export function useSearch(books: Book[]): UseSearchResult {
	const [query, setQueryRaw] = useState("");
	const [author, setAuthorRaw] = useState("");
	// Value of an <input type="date"> (yyyy-mm-dd). Books only carry a
	// publish *year*, so filtering matches that year against the date's year.
	const [date, setDateRaw] = useState("");
	const [isPending, startTransition] = useTransition();

	const setQuery = (value: string): void => {
		startTransition(() => setQueryRaw(value));
	};

	const setAuthor = (value: string): void => {
		startTransition(() => setAuthorRaw(value));
	};

	const setDate = (value: string): void => {
		startTransition(() => setDateRaw(value));
	};

	const clearFilters = (): void => {
		startTransition(() => {
			setQueryRaw("");
			setAuthorRaw("");
			setDateRaw("");
		});
	};

	/** Derived filtered list — recomputed only when deps change. */
	const results = useMemo(() => {
		const q = query.trim().toLowerCase();
		const year = date ? Number(date.slice(0, 4)) : null;
		return books.filter((book) => {
			const matchesQuery =
				!q ||
				book.title.toLowerCase().includes(q) ||
				(book.description ?? "").toLowerCase().includes(q);
			const matchesAuthor =
				!author || book.author.toLowerCase().includes(author.toLowerCase());
			const matchesDate = !year || book.publishedYear === year;
			return matchesQuery && matchesAuthor && matchesDate;
		});
	}, [books, query, author, date]);

	return {
		results,
		query,
		author,
		date,
		isPending,
		setQuery,
		setAuthor,
		setDate,
		clearFilters,
	};
}
