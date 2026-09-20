/**
 * Full "code delivered" screen.
 * Branches between real email delivery (CodeSentNotice) and
 * local dev display (DevCodeNotice) based on the `sent` flag.
 */
import {useNavigate} from "react-router";
import {Mail} from "lucide-react";
import {CodeSentNotice} from "./CodeSentNotice";
import {DevCodeNotice} from "./DevCodeNotice";
import {useLocale} from "../../i18n/LocaleContext";
import styles from "./ForgotPasswordForm.module.css";

interface ResetCodeDisplayProps {
	email: string;
	sent: boolean;
	devCode?: string;
}

export function ResetCodeDisplay({
	email,
	sent,
	devCode = "",
}: ResetCodeDisplayProps): React.ReactElement {
	const navigate = useNavigate();
	const {t} = useLocale();

	const handleContinue = (): void => {
		void navigate("/reset-password", {
			state: {email, code: sent ? "" : devCode},
		});
	};

	return (
		<div className={styles.codeBox}>
			<Mail size={32} className={styles.mailIcon} aria-hidden="true" />
			<p className={styles.codeTitle}>
				{sent ? t.forgotPassword.checkEmail : t.forgotPassword.devCodeTitle}
			</p>
			{sent ? <CodeSentNotice email={email} /> : <DevCodeNotice code={devCode} />}
			<p className={styles.codeNote}>{t.forgotPassword.codeValid}</p>
			<button type="button" className={styles.continueBtn} onClick={handleContinue}>
				{t.forgotPassword.enterCode}
			</button>
		</div>
	);
}
