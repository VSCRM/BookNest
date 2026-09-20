/**
 * GoogleLoginButton — redirects to the auth-service's Google OAuth2 login.
 *
 * `onLogin` is a plain navigation (`window.location.href = ...`), not an
 * API call: Spring Security's OAuth2 client owns the whole redirect dance
 * (Google consent screen -> callback -> OAuth2LoginSuccessHandler, which
 * sets the `booknest_jwt` cookie and redirects back to FRONTEND_URL). The
 * button just needs to send the browser to that starting URL.
 */
import {useLocale} from "../../i18n/LocaleContext";
import styles from "./forms.module.css";

interface GoogleIconProps {
	"aria-hidden": true;
}

function GoogleIcon(props: GoogleIconProps): React.ReactElement {
	return (
		<svg width="18" height="18" viewBox="0 0 48 48" {...props}>
			<path
				d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z"
				fill="#FFC107"
			/>
			<path
				d="M6.3 14.7l7 5.1C15.1 16.1 19.2 13 24 13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 16.3 2 9.7 7.3 6.3 14.7z"
				fill="#FF3D00"
			/>
			<path
				d="M24 46c5.5 0 10.5-1.9 14.3-5.1l-6.6-5.6C29.7 36.9 27 38 24 38c-6.1 0-10.7-3.9-11.8-9.1l-7 5.4C8.1 41 15.5 46 24 46z"
				fill="#4CAF50"
			/>
			<path
				d="M44.5 20H24v8.5h11.8c-.7 2.5-2.3 4.6-4.4 6l6.6 5.6C42.1 36.6 45 30.8 45 24c0-1.3-.2-2.7-.5-4z"
				fill="#1976D2"
			/>
		</svg>
	);
}

interface GoogleLoginButtonProps {
	onLogin: () => void;
}

export function GoogleLoginButton({onLogin}: GoogleLoginButtonProps): React.ReactElement {
	const {t} = useLocale();
	return (
		<>
			<div className={styles.googleDivider}>
				<span>{t.form.orDivider}</span>
			</div>
			<button
				type="button"
				className={styles.googleBtn}
				onClick={onLogin}
				aria-label={t.form.googleLogin}
			>
				<GoogleIcon aria-hidden={true} />
				{t.form.googleLogin}
			</button>
		</>
	);
}
