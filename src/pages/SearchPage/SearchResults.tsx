import {BookCard} from "../../components/BookCard/BookCard";
import {useLocale} from "../../i18n/LocaleContext";
import type {Book} from "../../schemas";
import styles from "./SearchPage.module.css";

interface SearchResultsProps {
	results: Book[];
	totalBooks: number;
	/** True while React is computing filtered results (useTransition). */
	isPending?: boolean;
}

export function SearchResults({
	results,
	totalBooks,
	isPending = false,
}: SearchResultsProps): React.ReactElement {
	const {t} = useLocale();

	return (
		<>
			<p className={styles.stats} aria-live="polite" aria-atomic="true">
				<span className={styles.statsIcon} aria-hidden="true">
					🔍
				</span>
				{t.search.foundOf(results.length, totalBooks)}
			</p>
			<div
				className={styles.grid}
				style={{opacity: isPending ? 0.6 : 1, transition: "opacity 0.2s"}}
				aria-busy={isPending}
			>
				{results.length > 0 ? (
					results.map((item) => <BookCard key={item.id} book={item} />)
				) : (
					<p className={styles.noResults}>{t.search.noResults}</p>
				)}
			</div>
		</>
	);
}
