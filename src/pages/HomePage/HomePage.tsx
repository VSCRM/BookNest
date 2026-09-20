import {useState, useEffect} from "react";
import {useBook} from "../../hooks/useBook";
import {useSearch} from "../../hooks/useSearch";
import {useSort} from "../../hooks/useSort";
import {useLocale} from "../../i18n/LocaleContext";
import {GenreFilter} from "./GenreFilter";
import {SortControl} from "../../components/SortControl/SortControl";
import {HomeGrid} from "./HomeGrid";
import {HomeLoading} from "./HomeLoading";
import {HomeError} from "./HomeError";
import {HomeSearchBar} from "./HomeSearchBar";
import {HomeResultCount} from "./HomeResultCount";
import {filterByGenre} from "./homeHelpers";
import {GENRES_BY_LOCALE} from "../../mock/bookData";
import styles from "./HomePage.module.css";

export function HomePage(): React.ReactElement {
	const {books, genres, loading, error, refetch} = useBook();
	const {results, query, setQuery, date, setDate, clearFilters} = useSearch(books);
	const {locale, t} = useLocale();

	// Always use the locale-aware "All" sentinel — reset when language switches.
	const allLabel = GENRES_BY_LOCALE[locale][0] ?? t.home.allGenres;
	const [activeGenre, setActiveGenre] = useState<string>(allLabel);
	useEffect(() => {
		setActiveGenre(allLabel);
	}, [allLabel]);

	const filtered = filterByGenre(results, activeGenre, locale);
	const {sorted, order, toggleOrder} = useSort(filtered, "publishedYear");

	if (loading) {
		return (
			<main aria-busy="true" aria-label={t.home.heading}>
				<HomeLoading />
			</main>
		);
	}
	if (error) {
		return (
			<main aria-label={t.home.heading}>
				<HomeError message={error} onRetry={refetch} />
			</main>
		);
	}

	return (
		<main aria-label={t.home.heading}>
			<h1 style={{textTransform: "uppercase", marginBottom: 24}}>
				{t.home.heading}
			</h1>

			<HomeSearchBar
				query={query}
				date={date}
				onQueryChange={setQuery}
				onDateChange={setDate}
				onClear={clearFilters}
			/>

			<div className={styles.toolbar} style={{marginBottom: 12}}>
				<GenreFilter
					genres={genres}
					active={activeGenre}
					onChange={setActiveGenre}
				/>
				<SortControl order={order} onToggle={toggleOrder} />
			</div>

			<HomeResultCount count={sorted.length} />

			{sorted.length === 0 ? (
				<p
					role="status"
					style={{
						textAlign: "center",
						padding: 40,
						color: "var(--color-gray)",
					}}
				>
					{t.home.empty}
				</p>
			) : (
				<HomeGrid books={sorted} />
			)}
		</main>
	);
}
