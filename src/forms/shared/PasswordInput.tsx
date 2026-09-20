import {useState, type InputHTMLAttributes} from "react";
import {Eye, EyeOff} from "lucide-react";
import {useLocale} from "../../i18n/LocaleContext";
import styles from "./forms.module.css";

interface PasswordInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
	name: string;
	label?: string;
	error?: string;
}

/** Password field with show/hide toggle. Uses Eye/EyeOff icons from lucide-react. */
export function PasswordInput({
	name,
	label,
	error,
	...rest
}: PasswordInputProps): React.ReactElement {
	const [visible, setVisible] = useState(false);
	const {t} = useLocale();

	return (
		<div className={styles.field}>
			{label && (
				<label className={styles.label} htmlFor={name}>
					{label}
				</label>
			)}
			<div className={styles.passwordWrap}>
				<input
					id={name}
					name={name}
					type={visible ? "text" : "password"}
					className={`${styles.input}${error ? ` ${styles.inputError}` : ""}`}
					aria-invalid={Boolean(error)}
					aria-describedby={error ? `${name}-error` : undefined}
					{...rest}
				/>
				<button
					type="button"
					className={styles.eyeBtn}
					aria-label={visible ? t.form.hidePassword : t.form.showPassword}
					aria-pressed={visible}
					onClick={() => setVisible((v) => !v)}
				>
					{visible ? <EyeOff size={18} /> : <Eye size={18} />}
				</button>
			</div>
			{error && (
				<span id={`${name}-error`} role="alert" className={styles.errorMsg}>
					{error}
				</span>
			)}
		</div>
	);
}
