import {useLocale} from "../../i18n/LocaleContext";
import styles from "./SavedBooksList.module.css";

export function SavedBooksEmpty(): React.ReactElement {
	const {t} = useLocale();
	return <p className={styles.empty}>{t.profile.savedEmpty}</p>;
}
