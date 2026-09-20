import {useLocale} from "../../i18n/LocaleContext";
import styles from "./LoginForm.module.css";

export function ResetSuccessBanner(): React.ReactElement {
	const {t} = useLocale();
	return (
		<p className={styles.resetSuccess} role="status">
			✓ {t.login.resetSuccessMsg}
		</p>
	);
}
