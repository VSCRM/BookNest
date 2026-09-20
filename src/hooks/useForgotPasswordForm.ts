import {useState, type ChangeEvent, type FormEvent} from "react";
import {authService} from "../services/authService";
import {validateEmail} from "../utils/validation";
import {useLocale} from "../i18n/LocaleContext";
import {resolveAuthError} from "../utils/resolveAuthError";
import type {ForgotPasswordResult} from "../schemas";

export interface UseForgotPasswordFormResult {
	email: string;
	emailError: string;
	loading: boolean;
	serverError: string;
	result: ForgotPasswordResult | null;
	handleEmailChange: (event: ChangeEvent<HTMLInputElement>) => void;
	handleSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
}

export function useForgotPasswordForm(): UseForgotPasswordFormResult {
	const {t} = useLocale();
	const [email, setEmail] = useState<string>("");
	const [emailError, setEmailError] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(false);
	const [serverError, setServerError] = useState<string>("");
	const [result, setResult] = useState<ForgotPasswordResult | null>(null);

	const handleEmailChange = (event: ChangeEvent<HTMLInputElement>): void => {
		const {value} = event.target;
		setEmail(value);
		setEmailError(validateEmail(value));
	};

	const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
		event.preventDefault();
		const validationError = validateEmail(email);
		if (validationError) {
			setEmailError(validationError);
			return;
		}

		setServerError("");
		setLoading(true);
		try {
			const response = await authService.forgotPassword(email);
			if (response.success) {
				setResult({
					success: true,
					email: response.email,
					sent: response.sent,
					devCode: response.devCode,
				});
			} else {
				setServerError(resolveAuthError(response.message, t));
			}
		} finally {
			setLoading(false);
		}
	};

	return {
		email,
		emailError,
		loading,
		serverError,
		result,
		handleEmailChange,
		handleSubmit,
	};
}
