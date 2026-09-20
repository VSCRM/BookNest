/**
 * Drives the edit-profile form.
 *
 * Password is optional — leaving it empty keeps the current password.
 * Validates the password field on every keystroke so the strength hint
 * and error message update in real time.
 */
import {useState} from "react";
import {useValidation} from "./useValidation";
import type {User} from "../schemas";
import type {UpdateUserPayload} from "../services/authService";

/** Return type exposed to the EditProfileForm component. */
export interface UseEditProfileFormResult {
	form: {nickname: string; password: string};
	errors: Record<string, string>;
	isSubmitDisabled: boolean;
	handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
}

export function useEditProfileForm(
	user: User | null,
	onSave: (payload: UpdateUserPayload) => Promise<void>,
): UseEditProfileFormResult {
	const [form, setForm] = useState({
		nickname: user?.nickname ?? "",
		password: "",
	});

	/** Validates only the password field (nickname has no strict rules here). */
	const {errors, validate} = useValidation(["password"]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
		const {name, value} = e.target;
		setForm((prev) => ({...prev, [name]: value}));
		// Real-time password validation on every keystroke.
		if (name === "password") validate("password", value);
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
		e.preventDefault();

		// Re-validate before submit (handles copy-paste bypass).
		const passwordError = form.password ? validate("password", form.password) : "";
		if (passwordError) return;

		// Build patch with only what actually changed.
		const payload: UpdateUserPayload = {};
		if (form.nickname && form.nickname !== user?.nickname) {
			payload.nickname = form.nickname;
		}
		if (form.password) {
			payload.password = form.password;
		}

		if (!Object.keys(payload).length) return;

		await onSave(payload);

		// Clear password after successful save.
		setForm((prev) => ({...prev, password: ""}));
	};

	return {
		form,
		errors,
		isSubmitDisabled: Boolean(errors["password"]),
		handleChange,
		handleSubmit,
	};
}
