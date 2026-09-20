import {useLocation, useNavigate} from "react-router";
import {FormInput} from "../../forms/shared/FormInput";
import {PasswordInput} from "../../forms/shared/PasswordInput";
import {PasswordStrengthHint} from "../../forms/shared/PasswordStrengthHint";
import {Toast} from "../../components/Toast/Toast";
import {useResetPasswordForm} from "../../hooks/useResetPasswordForm";
import {useLocale} from "../../i18n/LocaleContext";

export function ResetPasswordPage(): React.ReactElement {
	const location = useLocation();
	const navigate = useNavigate();
	const {t} = useLocale();

	const email = (location.state as {email?: string} | null)?.email ?? "";
	const prefillCode = (location.state as {code?: string} | null)?.code ?? "";

	const {form, errors, serverError, loading, handleChange, handleSubmit} =
		useResetPasswordForm(email);

	const validationTranslations = t.validation as unknown as Record<string, string>;

	const passwordMsg = errors.password
		? (validationTranslations[errors.password] ?? errors.password)
		: "";
	const confirmMsg = errors.confirmPassword
		? (validationTranslations[errors.confirmPassword] ?? errors.confirmPassword)
		: "";

	const codeValue = form.code || prefillCode;

	if (!email) {
		return (
			<main className="auth-page">
				<div className="auth-card">
					<Toast message={t.resetPassword.heading} variant="error" />
					<button
						type="button"
						className="btn btn--ghost btn--full"
						onClick={() => void navigate("/forgot-password")}
						style={{marginTop: 16}}
					>
						← {t.forgotPassword.heading}
					</button>
				</div>
			</main>
		);
	}

	return (
		<main className="auth-page" aria-labelledby="reset-heading">
			<div className="auth-card">
				<h1 id="reset-heading" className="auth-card__title">
					{t.resetPassword.heading}
				</h1>
				<p className="auth-card__subtitle">
					{t.resetPassword.emailLabel}: <strong>{email}</strong>
				</p>

				{serverError && <Toast message={serverError} variant="error" />}

				<form onSubmit={(e) => void handleSubmit(e)} noValidate>
					<FormInput
						label={t.resetPassword.codeLabel}
						name="code"
						type="text"
						inputMode="numeric"
						maxLength={6}
						autoComplete="one-time-code"
						placeholder={t.resetPassword.codePlaceholder}
						value={codeValue}
						onChange={handleChange}
						required
					/>

					<PasswordInput
						label={t.resetPassword.newPasswordLabel}
						name="password"
						autoComplete="new-password"
						value={form.password}
						onChange={handleChange}
						error={passwordMsg}
					/>
					<PasswordStrengthHint password={form.password} />

					<PasswordInput
						label={t.resetPassword.confirmLabel}
						name="confirmPassword"
						autoComplete="new-password"
						value={form.confirmPassword}
						onChange={handleChange}
						error={confirmMsg}
					/>

					<button
						type="submit"
						className="btn btn--primary btn--full"
						disabled={loading || !codeValue || !form.password}
						aria-busy={loading}
					>
						{loading ? t.resetPassword.loadingBtn : t.resetPassword.submitBtn}
					</button>
				</form>

				<nav className="auth-card__links">
					<a
						href="/login"
						className="auth-card__link"
						onClick={(e) => {
							e.preventDefault();
							void navigate("/login");
						}}
					>
						← {t.resetPassword.backToLogin}
					</a>
				</nav>
			</div>
		</main>
	);
}
