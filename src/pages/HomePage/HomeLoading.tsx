import {Spinner} from "../../components/ui/Spinner";
import {useLocale} from "../../i18n/LocaleContext";
import styles from "./HomePage.module.css";

export function HomeLoading(): React.ReactElement {
	const {t} = useLocale();
	return (
		<div className={styles.loader} role="status" aria-live="polite">
			<Spinner size={28} label={t.home.loading} />
		</div>
	);
}
