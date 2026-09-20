/**
 * Login form.
 *
 * Email is validated on every keystroke (onChange) matching the original
 * real-time behaviour — not on blur.
 */
import {type ChangeEvent} from "react";
import {AuthLayout} from "../../components/AuthLayout/AuthLayout";
import {FormInput} from "../shared/FormInput";
import {PasswordInput} from "../shared/PasswordInput";
import {PasswordStrengthHint} from "../shared/PasswordStrengthHint";
import {SubmitButton} from "../shared/SubmitButton";
import {FormError} from "../shared/FormError";
import {GoogleLoginButton} from "../shared/GoogleLoginButton";
import {LoginFormFooter} from "./LoginFormFooter";
import {ResetSuccessBanner} from "./ResetSuccessBanner";
import {validateEmail} from "../../utils/validation";
import {useLoginForm} from "../../hooks/useLoginForm";
import {useLocale} from "../../i18n/LocaleContext";
import config from "../../config";

export function LoginForm(): React.ReactElement {
	const {t} = useLocale();
	const {
		email,
		password,
		emailError,
		authError,
		loading,
		resetSuccess,
		redirectTo,
		setEmail,
		setPassword,
		setEmailError,
		handleSubmit,
	} = useLoginForm();

	/** Validate email on every keystroke — real-time feedback. */
	const handleEmailChange = (e: ChangeEvent<HTMLInputElement>): void => {
		const val = e.target.value;
		setEmail(val);
		const key = validateEmail(val);
		const validationTranslations = t.validation as unknown as Record<string, string>;
		setEmailError(key ? (validationTranslations[key] ?? "") : "");
	};

	const isSubmitDisabled = Boolean(emailError) || !email || !password;

	return (
		<AuthLayout title={t.login.heading}>
			{resetSuccess && <ResetSuccessBanner />}
			{/* authError is now ALSO surfaced inline on the password field
			    below (it wasn't before — PasswordInput supports an `error`
			    prop but LoginForm never passed one). Left here too so
			    non-field errors like rate-limiting stay visible even if the
			    password field scrolls out of view. */}
			<FormError message={authError} />

			<form onSubmit={(e) => void handleSubmit(e)} noValidate>
				<FormInput
					name="email"
					type="email"
					placeholder="EMAIL"
					value={email}
					error={emailError}
					onChange={handleEmailChange}
					autoComplete="email"
				/>
				<PasswordInput
					name="password"
					placeholder={t.login.passwordLabel.toUpperCase()}
					value={password}
					error={authError}
					onChange={(e) => setPassword(e.target.value)}
					autoComplete="current-password"
				/>
				<PasswordStrengthHint password={password} />

				<SubmitButton
					loading={loading}
					disabled={isSubmitDisabled}
					label={t.login.submitBtn.toUpperCase()}
					loadingLabel={t.login.loadingBtn}
				/>
			</form>

			<GoogleLoginButton
				onLogin={() => {
					// Full-page navigation on purpose: Spring Security's OAuth2
					// client needs to own the redirect to Google's consent
					// screen and back, which a fetch/XHR call can't do.
					//
					// `redirect_uri` tells the auth-service where to send the
					// browser back to once Google confirms the login (see
					// CustomAuthorizationRequestResolver /
					// OAuth2LoginSuccessHandler on that service) — the same
					// destination the email/password flow above already uses.
					// Without it, every Google login landed on /profile no
					// matter what the person was doing, which silently
					// dropped an in-progress checkout: CartPage only resumes
					// one from its own mount effect, which never got the
					// chance to run.
					const target = `${config.AUTH_ROOT_URL}/oauth2/authorization/google?redirect_uri=${encodeURIComponent(redirectTo)}`;
					window.location.href = target;
				}}
			/>
			<LoginFormFooter />
		</AuthLayout>
	);
}
