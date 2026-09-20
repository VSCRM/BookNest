/**
 * Generic labelled text input.
 *
 * Uses `forms.module.css` for all class names — same as the original project.
 * The `label` prop is optional; when omitted only `placeholder` is shown
 * (matches the original uppercase-placeholder visual design).
 */
import type {InputHTMLAttributes} from "react";
import styles from "./forms.module.css";

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
	name: string;
	label?: string;
	error?: string;
	type?: string;
}

export function FormInput({
	name,
	label,
	error,
	type = "text",
	...rest
}: FormInputProps): React.ReactElement {
	return (
		<div className={styles.field}>
			{label && (
				<label className={styles.label} htmlFor={name}>
					{label}
				</label>
			)}
			<input
				id={name}
				name={name}
				type={type}
				className={`${styles.input}${error ? ` ${styles.inputError}` : ""}`}
				aria-invalid={Boolean(error)}
				aria-describedby={error ? `${name}-error` : undefined}
				{...rest}
			/>
			{error && (
				<span id={`${name}-error`} role="alert" className={styles.errorMsg}>
					{error}
				</span>
			)}
		</div>
	);
}
