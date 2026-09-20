import {X} from "lucide-react";
import {useLocale} from "../../i18n/LocaleContext";
import styles from "./SearchPage.module.css";

interface SearchFiltersProps {
	query: string;
	setQuery: (value: string) => void;
	author: string;
	setAuthor: (value: string) => void;
	clearFilters: () => void;
}

export function SearchFilters({
	query,
	setQuery,
	author,
	setAuthor,
	clearFilters,
}: SearchFiltersProps): React.ReactElement {
	const {t} = useLocale();
	const hasFilters = query.trim() || author.trim();

	return (
		<>
			<div className={styles.inputWrapper}>
				<span className={styles.searchIcon} aria-hidden="true">
					🔍
				</span>
				<input
					type="text"
					className={styles.inputText}
					placeholder={t.search.inputPlaceholder}
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					aria-label={t.search.inputLabel}
					maxLength={200}
					autoComplete="off"
				/>
			</div>

			<input
				type="text"
				className={styles.inputAuthor}
				placeholder="Автор…"
				value={author}
				onChange={(e) => setAuthor(e.target.value)}
				aria-label={t.search.authorLabel}
				maxLength={200}
				autoComplete="off"
			/>

			{hasFilters && (
				<button className={styles.clearBtn} onClick={clearFilters}>
					<X size={14} aria-hidden="true" /> {t.search.resetFilters}
				</button>
			)}
		</>
	);
}
