import {useState, type ChangeEvent, type FormEvent} from "react";
import {useNavigate} from "react-router";
import {authService} from "../services/authService";
import {validatePassword} from "../utils/validation";
import {useLocale} from "../i18n/LocaleContext";
import {resolveAuthError} from "../utils/resolveAuthError";

interface ResetPasswordFormFields {
	code: string;
	password: string;
	confirmPassword: string;
}

/** Only password fields are validated client-side; code is validated server-side. */
export interface ResetPasswordFormErrors {
	password?: string;
	confirmPassword?: string;
}

export interface UseResetPasswordFormResult {
	form: ResetPasswordFormFields;
	errors: ResetPasswordFormErrors;
	serverError: string;
	loading: boolean;
	handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
	handleSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
}

/**
 * Manages the reset-password form state and submission.
 *
 * @param email - The account email (passed via router state from the
 *   forgot-password flow). Used directly in the API call.
 */
export function useResetPasswordForm(email: string): UseResetPasswordFormResult {
	const [form, setForm] = useState<ResetPasswordFormFields>({
		code: "",
		password: "",
		confirmPassword: "",
	});
	const {t} = useLocale();
	const [errors, setErrors] = useState<ResetPasswordFormErrors>({});
	const [serverError, setServerError] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(false);
	const navigate = useNavigate();

	const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
		const {name, value} = event.target;
		setForm((prev) => ({...prev, [name]: value}));

		if (name === "password") {
			// Return a raw key; the component resolves it via t.validation[key].
			setErrors((prev) => ({...prev, password: validatePassword(value)}));
		}

		if (name === "confirmPassword") {
			setErrors((prev) => ({
				...prev,
				// Use a validation key so the component can translate it.
				confirmPassword: value !== form.password ? "passwordMismatch" : "",
			}));
		}
	};

	const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
		event.preventDefault();
		setServerError("");

		const passwordError = validatePassword(form.password);
		const confirmError =
			form.password !== form.confirmPassword ? "passwordMismatch" : "";

		if (passwordError || confirmError) {
			setErrors({password: passwordError, confirmPassword: confirmError});
			return;
		}

		setLoading(true);
		try {
			const response = await authService.resetPassword(
				email,
				form.code,
				form.password,
			);
			if (response.success) {
				void navigate("/login", {state: {resetSuccess: true}});
			} else {
				setServerError(resolveAuthError(response.message, t));
			}
		} finally {
			setLoading(false);
		}
	};

	return {
		form,
		errors,
		serverError,
		loading,
		handleChange,
		handleSubmit,
	};
}
