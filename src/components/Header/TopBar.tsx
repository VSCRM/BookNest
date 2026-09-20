import {Calendar, MapPin} from "lucide-react";
import {useLocale} from "../../i18n/LocaleContext";
import styles from "./Header.module.css";

interface TopBarProps {
	date: string;
}

export function TopBar({date}: TopBarProps): React.ReactElement {
	const {t} = useLocale();
	return (
		<div className={styles.topBar}>
			<div className={styles.topBarItem}>
				<Calendar size={14} aria-hidden="true" />
				<time dateTime={new Date().toISOString().slice(0, 10)}>{date}</time>
			</div>
			<div className={styles.topBarItem}>
				<MapPin size={14} aria-hidden="true" />
				<span>{t.layout.city}</span>
			</div>
		</div>
	);
}
