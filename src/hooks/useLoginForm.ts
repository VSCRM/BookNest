import {useState, type FormEvent} from "react";
import {useNavigate, useLocation} from "react-router";
import {useAuth} from "./useAuth";
import {useLocale} from "../i18n/LocaleContext";
import {resolveAuthError} from "../utils/resolveAuthError";

export interface UseLoginFormResult {
	email: string;
	password: string;
	emailError: string;
	authError: string;
	loading: boolean;
	resetSuccess: boolean;
	/**
	 * Route to land on after a successful login — the page the person came
	 * from (e.g. /cart mid-checkout), or /profile by default. Exposed so
	 * LoginForm can pass it to the Google button too: that flow is a
	 * server-side redirect, so this can't be applied client-side the way
	 * `handleSubmit` below applies it for email/password login.
	 */
	redirectTo: string;
	setEmail: (v: string) => void;
	setPassword: (v: string) => void;
	setEmailError: (v: string) => void;
	handleSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
}

/** Manages state and submission for the login form. */
export function useLoginForm(): UseLoginFormResult {
	const {login, loading} = useAuth();
	const {t} = useLocale();
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [emailError, setEmailError] = useState<string>("");
	const [authError, setAuthError] = useState<string>("");
	const navigate = useNavigate();
	const location = useLocation();

	/** Route the user came from, or /profile as the default destination. */
	const redirectTo =
		(location.state as {from?: {pathname?: string}} | null)?.from?.pathname ??
		"/profile";

	/** True when the user just completed a successful password reset. */
	const resetSuccess =
		(location.state as {resetSuccess?: boolean} | null)?.resetSuccess ?? false;

	const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
		event.preventDefault();
		setAuthError("");

		const result = await login(email, password);

		if (!result.success) {
			setAuthError(resolveAuthError(result.message, t));
		} else {
			void navigate(redirectTo, {replace: true});
		}
	};

	return {
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
	};
}
