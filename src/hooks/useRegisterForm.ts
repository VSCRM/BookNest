/**
 * Drives the register form.
 *
 * Validates every field on each keystroke (onChange) so errors appear in
 * real time — matching the original project's UX. Validation error keys
 * are resolved to the active locale's strings via useValidation().
 */
import {useState} from "react";
import {useNavigate} from "react-router";
import {useAuth} from "./useAuth";
import {useValidation} from "./useValidation";
import {useLocale} from "../i18n/LocaleContext";
import {resolveAuthError} from "../utils/resolveAuthError";

export function useRegisterForm() {
	const {register, loading} = useAuth();
	const {t} = useLocale();
	const [form, setForm] = useState({email: "", nickname: "", password: ""});
	const [authError, setAuthError] = useState("");
	const navigate = useNavigate();

	/**
	 * useValidation resolves raw validation keys ('required', 'invalidEmail', …)
	 * into the active-locale strings automatically.
	 */
	const {errors, validate} = useValidation(["email", "nickname", "password"]);

	/** Validate the changed field on every keystroke. */
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
		const {name, value} = e.target;
		setForm((prev) => ({...prev, [name]: value}));
		validate(name, value);
	};

	/** True when required fields are filled and no validation errors exist. */
	const isValid =
		!errors["email"] &&
		!errors["nickname"] &&
		!errors["password"] &&
		Boolean(form.email) &&
		Boolean(form.password);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
		e.preventDefault();
		setAuthError("");
		const result = await register(form.email, form.password, form.nickname);
		if (!result.success) {
			setAuthError(resolveAuthError(result.message, t));
		} else {
			void navigate("/profile");
		}
	};

	return {
		form,
		errors,
		authError,
		loading,
		isValid,
		handleChange,
		handleSubmit,
	};
}
