/**
 * Search + date filter toolbar for the home page.
 * Extracted from HomePage to keep that component focused on layout and state.
 */
import {useLocale} from "../../i18n/LocaleContext";
import styles from "./HomePage.module.css";

interface HomeSearchBarProps {
	query: string;
	date: string;
	onQueryChange: (v: string) => void;
	onDateChange: (v: string) => void;
	onClear: () => void;
}

export function HomeSearchBar({
	query,
	date,
	onQueryChange,
	onDateChange,
	onClear,
}: HomeSearchBarProps): React.ReactElement {
	const {t} = useLocale();

	return (
		<div className={styles.toolbar}>
			<input
				type="search"
				placeholder={t.home.searchPlaceholder}
				value={query}
				onChange={(e) => onQueryChange(e.target.value)}
				aria-label={t.home.searchLabel}
				style={{
					flex: 1,
					padding: "10px 14px",
					border: "var(--border-std)",
					background: "var(--color-white)",
					fontFamily: "var(--font-mono)",
					fontSize: 14,
				}}
			/>
			<input
				type="date"
				value={date}
				onChange={(e) => onDateChange(e.target.value)}
				aria-label={t.home.dateLabel}
				style={{
					padding: "10px 12px",
					border: "var(--border-std)",
					background: "var(--color-white)",
					fontFamily: "var(--font-mono)",
					fontSize: 13,
					color: "var(--color-dark)",
				}}
			/>
			{(query || date) && (
				<button
					type="button"
					onClick={onClear}
					style={{
						padding: "10px 16px",
						border: "var(--border-std)",
						background: "none",
						cursor: "pointer",
						fontFamily: "var(--font-mono)",
						fontSize: 12,
						textTransform: "uppercase",
					}}
				>
					{t.home.clearFilters}
				</button>
			)}
		</div>
	);
}
