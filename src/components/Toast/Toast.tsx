import {CheckCircle2, X} from "lucide-react";
import {useLocale} from "../../i18n/LocaleContext";
import styles from "./Toast.module.css";

interface ToastProps {
	message: string;
	onClose?: () => void;
	/** Optional variant for error styling. */
	variant?: "success" | "error";
}

/** Slide-in notification. Rendered outside forms so it survives unmount. */
export function Toast({
	message,
	onClose,
	variant = "success",
}: ToastProps): React.ReactElement {
	const {t} = useLocale();

	return (
		<div
			className={`${styles.toast} ${variant === "error" ? styles.toastError : ""}`}
			role="status"
			aria-live="polite"
		>
			<CheckCircle2 size={18} className={styles.icon} aria-hidden="true" />
			<span>{message}</span>
			{onClose && (
				<button
					className={styles.closeBtn}
					onClick={onClose}
					aria-label={t.form.closeNotice}
				>
					<X size={14} />
				</button>
			)}
		</div>
	);
}
