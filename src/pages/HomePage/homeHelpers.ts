import type {Book} from "../../schemas";
import {GENRES_BY_LOCALE} from "../../mock/bookData";
import type {Locale} from "../../i18n/translations";

/**
 * Filters books by genre.
 *
 * Returns the full list when `genre` equals the locale-specific "All"
 * sentinel (a localized "All genres" label, one per locale).
 *
 * @param books - Full book list to filter.
 * @param genre - Currently selected genre label.
 * @param locale   - Active app locale (used to identify the "All" sentinel).
 */
export function filterByGenre(
	books: Book[],
	genre: string,
	locale: Locale = "uk",
): Book[] {
	const allLabel = GENRES_BY_LOCALE[locale][0];
	if (genre === allLabel) return books;
	return books.filter((a) => a.genre === genre);
}
