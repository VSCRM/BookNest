import type {SortOrder} from "../../schemas";
import {useLocale} from "../../i18n/LocaleContext";
import styles from "./SortControl.module.css";

interface SortControlProps {
	order: SortOrder;
	onToggle: () => void;
}

export function SortControl({order, onToggle}: SortControlProps): React.ReactElement {
	const {t} = useLocale();
	const label = order === "desc" ? t.sort.newestFirst : t.sort.oldestFirst;
	const ariaLabel = order === "desc" ? t.sort.ariaNewest : t.sort.ariaOldest;

	return (
		<button
			type="button"
			onClick={onToggle}
			className={styles.btn}
			aria-label={ariaLabel}
			aria-pressed={order === "asc"}
		>
			<span aria-hidden="true">{order === "desc" ? "↓" : "↑"}</span>
			{label}
		</button>
	);
}
