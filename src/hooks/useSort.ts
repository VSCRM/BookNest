import {useState, useMemo} from "react";
import type {SortOrder} from "../schemas";

export interface UseSortResult<T> {
	sorted: T[];
	order: SortOrder;
	toggleOrder: () => void;
}

/**
 * Sorts an array of objects by a given string/number key.
 * Returns a new sorted array without mutating the input.
 *
 * @param items - Array to sort.
 * @param field - Key to sort by (defaults to `'date'`).
 */
export function useSort<T extends Record<string, unknown>>(
	items: T[],
	field: keyof T & string = "date",
): UseSortResult<T> {
	const [order, setOrder] = useState<SortOrder>("desc");

	const sorted = useMemo<T[]>(() => {
		if (!items?.length) return items ?? [];
		return [...items].sort((a, b) => {
			const aVal = a[field] ?? "";
			const bVal = b[field] ?? "";
			if (aVal < bVal) return order === "asc" ? -1 : 1;
			if (aVal > bVal) return order === "asc" ? 1 : -1;
			return 0;
		});
	}, [items, field, order]);

	const toggleOrder = (): void => setOrder((prev) => (prev === "asc" ? "desc" : "asc"));

	return {
		sorted,
		order,
		toggleOrder,
	};
}
