import {useLocale} from "../../i18n/LocaleContext";
import styles from "./ForgotPasswordForm.module.css";

interface CodeSentNoticeProps {
	email: string;
}

/** Shown when EmailJS delivered the reset code successfully. */
export function CodeSentNotice({email}: CodeSentNoticeProps): React.ReactElement {
	const {t} = useLocale();
	return <p className={styles.codeDesc}>{t.forgotPassword.codeSentDesc(email)}</p>;
}
