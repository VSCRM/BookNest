import {Link} from "react-router";
import {useLocale} from "../../i18n/LocaleContext";
import styles from "./LoginForm.module.css";

/**
 * Footer: "Forgot password?" on one row, "No account? Create account" on the next.
 * Two separate paragraphs as requested — not a single inline row.
 */
export function LoginFormFooter(): React.ReactElement {
	const {t} = useLocale();

	return (
		<div className={styles.footer}>
			<p className={styles.footerRow}>
				<Link to="/forgot-password" className={styles.forgotLink}>
					{t.login.forgotPasswordText}
				</Link>
			</p>
			<p className={styles.footerRow}>
				<span className={styles.footerText}>{t.login.noAccountText}</span>{" "}
				<Link to="/register" className={styles.registerLink}>
					{t.login.noAccountLink}
				</Link>
			</p>
		</div>
	);
}
