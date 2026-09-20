/**
 * NotFoundPage — shown for any route that doesn't match one of the app's
 * real pages (wired up as the `*` route in App.tsx). A small CSS-only
 * animation (wobbling books on a shelf) instead of a plain error message.
 */
import {Link} from "react-router";
import {useLocale} from "../../i18n/LocaleContext";
import styles from "./NotFoundPage.module.css";

export function NotFoundPage(): React.ReactElement {
	const {t} = useLocale();

	return (
		<div className={styles.wrapper}>
			<div className={styles.shelf} aria-hidden="true">
				<div className={styles.book} />
				<div className={styles.book} />
				<div className={styles.book} />
				<div className={styles.plank} />
			</div>

			<p className={styles.code}>404</p>
			<h1 className={styles.title}>{t.notFound.title}</h1>
			<p className={styles.subtitle}>{t.notFound.subtitle}</p>
			<Link to="/" className={styles.homeLink}>
				{t.notFound.homeLink}
			</Link>
		</div>
	);
}
