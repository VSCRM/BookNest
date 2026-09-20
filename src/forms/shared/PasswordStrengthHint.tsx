/**
 * Strength bar + per-rule checklist shown below a password field.
 * Rules turn green (✓) as each requirement is met — identical behaviour
 * to the original the original reference project PasswordStrengthHint.jsx.
 */
import {getPasswordStrength} from "../../utils/validation";
import {useLocale} from "../../i18n/LocaleContext";
import styles from "./PasswordStrengthHint.module.css";

interface PasswordStrengthHintProps {
	password: string;
}

/** Each rule: translated label + test function. */
function useRules() {
	const {t} = useLocale();
	return [
		{label: t.validation.rules.minLength, test: (v: string) => v.length >= 6},
		{
			label: t.validation.rules.latinOnly,
			test: (v: string) => !/[\u0080-\uFFFF]/.test(v),
		},
		{label: t.validation.rules.upperCase, test: (v: string) => /[A-Z]/.test(v)},
		{label: t.validation.rules.digit, test: (v: string) => /[0-9]/.test(v)},
	];
}

export function PasswordStrengthHint({
	password,
}: PasswordStrengthHintProps): React.ReactElement | null {
	const {t} = useLocale();
	const rules = useRules();
	const strength = getPasswordStrength(password);

	if (!password) return null;

	const levelLabel = strength
		? (t.passwordStrength[
				strength.labelKey as keyof typeof t.passwordStrength
			] as string)
		: "";

	return (
		<div
			className={styles.wrap}
			data-testid="password-strength"
			aria-live="polite"
			role="status"
		>
			{strength && (
				<div className={styles.barRow}>
					<div
						className={`${styles.bar} ${styles[`bar_${strength.level}` as keyof typeof styles] ?? ""}`}
						role="progressbar"
						aria-valuenow={
							strength.level === "weak"
								? 33
								: strength.level === "medium"
									? 66
									: 100
						}
						aria-valuemin={0}
						aria-valuemax={100}
						aria-label={t.passwordStrength.ariaLabel(levelLabel)}
					/>
					<span
						className={`${styles.label} ${styles[`label_${strength.level}` as keyof typeof styles] ?? ""}`}
					>
						{levelLabel}
					</span>
				</div>
			)}

			<ul className={styles.rules}>
				{rules.map(({label, test}) => (
					<li
						key={label}
						className={test(password) ? styles.ruleOk : styles.ruleNo}
					>
						{label}
					</li>
				))}
			</ul>
		</div>
	);
}
