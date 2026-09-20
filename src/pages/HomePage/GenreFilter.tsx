import {useLocale} from "../../i18n/LocaleContext";
import styles from "./GenreFilter.module.css";

interface GenreFilterProps {
	genres: readonly string[];
	active: string;
	onChange: (genre: string) => void;
}

export function GenreFilter({
	genres,
	active,
	onChange,
}: GenreFilterProps): React.ReactElement {
	const {t} = useLocale();

	return (
		<nav className={styles.wrap} aria-label={t.home.genreNav}>
			{genres.map((cat) => (
				<button
					key={cat}
					type="button"
					className={
						active === cat ? `${styles.btn} ${styles.btnActive}` : styles.btn
					}
					onClick={() => onChange(cat)}
					aria-pressed={active === cat}
				>
					{cat}
				</button>
			))}
		</nav>
	);
}
