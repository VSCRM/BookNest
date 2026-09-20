/**
 * Full-text search page.
 *
 * `useSearch` uses `useTransition` internally, so `isPending` is true while
 * React is computing the filtered result.  We pass it to SearchResults to
 * show a subtle opacity change during filtering.
 */
import {useBook} from "../../hooks/useBook";
import {useSearch} from "../../hooks/useSearch";
import {useSort} from "../../hooks/useSort";
import {SearchFilters} from "./SearchFilters";
import {SearchResults} from "./SearchResults";
import {SortControl} from "../../components/SortControl/SortControl";
import styles from "./SearchPage.module.css";

export function SearchPage(): React.ReactElement {
	const {books} = useBook();
	const {results, query, setQuery, author, setAuthor, clearFilters, isPending} =
		useSearch(books);
	// Sort by publishedYear — Book has no `date` field, so calling
	// useSort(results) with the default field name was a no-op (every
	// item compared equal). Matches the field HomePage sorts by.
	const {sorted, order, toggleOrder} = useSort(results, "publishedYear");

	return (
		<>
			<div className={styles.searchBox}>
				<SearchFilters
					query={query}
					setQuery={setQuery}
					author={author}
					setAuthor={setAuthor}
					clearFilters={clearFilters}
				/>
				<SortControl order={order} onToggle={toggleOrder} />
			</div>
			<SearchResults
				results={sorted}
				totalBooks={books.length}
				isPending={isPending}
			/>
		</>
	);
}
