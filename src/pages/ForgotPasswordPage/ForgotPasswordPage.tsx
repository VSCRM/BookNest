import {useNavigate} from "react-router";
import {FormInput} from "../../forms/shared/FormInput";
import {Toast} from "../../components/Toast/Toast";
import {ResetCodeDisplay} from "../../forms/ForgotPasswordForm/ResetCodeDisplay";
import {useForgotPasswordForm} from "../../hooks/useForgotPasswordForm";
import {useLocale} from "../../i18n/LocaleContext";

export function ForgotPasswordPage(): React.ReactElement {
	const {t} = useLocale();
	const navigate = useNavigate();
	const {
		email,
		emailError,
		loading,
		serverError,
		result,
		handleEmailChange,
		handleSubmit,
	} = useForgotPasswordForm();

	if (result) {
		return (
			<main className="auth-page" aria-labelledby="forgot-heading">
				<div className="auth-card">
					<h1 id="forgot-heading" className="auth-card__title">
						{t.forgotPassword.codeSentTitle}
					</h1>
					<ResetCodeDisplay
						email={result.email}
						sent={result.sent}
						devCode={result.devCode}
					/>
				</div>
			</main>
		);
	}

	return (
		<main className="auth-page" aria-labelledby="forgot-heading">
			<div className="auth-card">
				<h1 id="forgot-heading" className="auth-card__title">
					{t.forgotPassword.heading}
				</h1>
				<p className="auth-card__subtitle">{t.forgotPassword.desc}</p>

				{serverError && <Toast message={serverError} />}

				<form onSubmit={(e) => void handleSubmit(e)} noValidate>
					<FormInput
						name="email"
						type="email"
						placeholder={t.forgotPassword.emailPlaceholder}
						value={email}
						error={emailError}
						onChange={handleEmailChange}
						autoComplete="email"
					/>
					<button
						type="submit"
						className="btn btn--primary btn--full"
						disabled={loading}
						aria-busy={loading}
						style={{marginTop: 8}}
					>
						{loading
							? t.forgotPassword.loadingBtn
							: t.forgotPassword.submitBtn}
					</button>
				</form>

				<nav className="auth-card__links" aria-label="related pages">
					<a
						href="/login"
						className="auth-card__link"
						onClick={(e) => {
							e.preventDefault();
							void navigate("/login");
						}}
					>
						← {t.forgotPassword.backToLogin}
					</a>
				</nav>
			</div>
		</main>
	);
}
