/**
 * Shown in development mode when EmailJS is not configured.
 * Displays the raw reset code with a copy-to-clipboard button.
 */
import {useState, useEffect, useRef} from "react";
import {Copy, Check} from "lucide-react";
import {useLocale} from "../../i18n/LocaleContext";
import styles from "./ForgotPasswordForm.module.css";

interface DevCodeNoticeProps {
	code: string;
}

export function DevCodeNotice({code}: DevCodeNoticeProps): React.ReactElement {
	const [copied, setCopied] = useState<boolean>(false);
	const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const {t} = useLocale();

	// Clear the timer if the component unmounts before it fires.
	useEffect(() => {
		return () => {
			if (timerRef.current) clearTimeout(timerRef.current);
		};
	}, []);

	const handleCopy = async (): Promise<void> => {
		try {
			await navigator.clipboard.writeText(code);
			setCopied(true);
			if (timerRef.current) clearTimeout(timerRef.current);
			timerRef.current = setTimeout(() => {
				setCopied(false);
				timerRef.current = null;
			}, 2000);
		} catch {
			// Clipboard API unavailable (non-HTTPS in dev)
		}
	};

	return (
		<>
			<p className={styles.codeDesc}>{t.forgotPassword.devCodeDesc}</p>
			<div className={styles.codeDisplay}>
				<span className={styles.codeValue}>{code}</span>
				<button
					type="button"
					className={styles.copyBtn}
					onClick={() => void handleCopy()}
					aria-label={t.forgotPassword.copyCode}
				>
					{copied ? (
						<Check size={16} aria-hidden="true" />
					) : (
						<Copy size={16} aria-hidden="true" />
					)}
				</button>
			</div>
		</>
	);
}
