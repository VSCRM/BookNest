/**
 * Registration form.
 *
 * `useRegisterForm.handleChange` validates every field on every keystroke
 * — errors appear in real time as the user types.
 */
import {Link} from "react-router";
import {AuthLayout} from "../../components/AuthLayout/AuthLayout";
import {FormInput} from "../shared/FormInput";
import {PasswordInput} from "../shared/PasswordInput";
import {PasswordStrengthHint} from "../shared/PasswordStrengthHint";
import {SubmitButton} from "../shared/SubmitButton";
import {FormError} from "../shared/FormError";
import {useRegisterForm} from "../../hooks/useRegisterForm";
import {useLocale} from "../../i18n/LocaleContext";
import styles from "../shared/forms.module.css";

export function RegisterForm(): React.ReactElement {
	const {t} = useLocale();
	const {form, errors, authError, loading, isValid, handleChange, handleSubmit} =
		useRegisterForm();

	return (
		<AuthLayout title={t.register.heading}>
			<FormError message={authError} />

			<form onSubmit={(e) => void handleSubmit(e)} noValidate>
				<FormInput
					name="email"
					type="email"
					placeholder="EMAIL"
					value={form.email}
					error={errors.email}
					onChange={handleChange}
					autoComplete="email"
				/>
				<FormInput
					name="nickname"
					placeholder={t.register.nicknameLabel.toUpperCase()}
					value={form.nickname}
					error={errors.nickname}
					onChange={handleChange}
					autoComplete="username"
					required={false}
				/>
				<PasswordInput
					name="password"
					placeholder={t.register.passwordLabel.toUpperCase()}
					value={form.password}
					error={errors.password}
					onChange={handleChange}
					autoComplete="new-password"
				/>
				<PasswordStrengthHint password={form.password} />

				<div style={{marginTop: 15}}>
					<SubmitButton
						loading={loading}
						disabled={!isValid}
						label={t.register.submitBtn.toUpperCase()}
						loadingLabel={t.register.loadingBtn}
					/>
				</div>
			</form>

			<div className={styles.formFooter}>
				<p style={{margin: "0 0 4px", color: "var(--color-gray)", fontSize: 12}}>
					{t.register.hasAccountText}
				</p>
				<Link to="/login" className={styles.footerLink}>
					{t.register.hasAccountLink}
				</Link>
			</div>
		</AuthLayout>
	);
}
