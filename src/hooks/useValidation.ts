/**
 * Generic field-validation hook.
 *
 * Resolves validation error keys (returned by utils/validation.ts) to
 * human-readable strings in the active locale.
 *
 * Usage:
 *   const { errors, validate, validateAll } = useValidation(['email', 'password']);
 *   validate('email', 'bad-value');
 *   // errors.email === 'Invalid email format' (in active locale)
 */

import {useState, useCallback, useMemo} from "react";
import {VALIDATORS} from "../utils/validation";
import {useLocale} from "../i18n/LocaleContext";

type FieldErrors = Record<string, string>;

interface UseValidationResult {
	errors: FieldErrors;
	validate: (name: string, value: string) => string;
	validateAll: (fields: Record<string, string>) => boolean;
	setFieldError: (name: string, error: string) => void;
	clearErrors: () => void;
	isValid: boolean;
}

/**
 * @param fieldNames - Names of fields this hook will manage.
 *   Stable across renders — do not create the array inline inside a component.
 */
export function useValidation(fieldNames: string[]): UseValidationResult {
	// Stable empty-error map that never changes reference — safe as reset target.
	const emptyErrors = useMemo(
		() => Object.fromEntries(fieldNames.map((n) => [n, ""])),
		// Field names should not change after mount; exhaustive-deps is intentional here.
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[],
	);

	const [errors, setErrors] = useState<FieldErrors>(emptyErrors);
	const {t} = useLocale();

	/**
	 * Resolves a raw validation key ('required', 'invalidEmail', …) to the
	 * translated message for the active locale.
	 */
	const resolveKey = useCallback(
		(key: string): string => {
			if (!key) return "";
			const v = t.validation as Record<string, unknown>;
			return typeof v[key] === "string" ? (v[key] as string) : key;
		},
		[t],
	);

	/** Validates a single field and updates the errors state. */
	const validate = useCallback(
		(name: string, value: string): string => {
			const validator = VALIDATORS[name];
			const rawKey = validator ? validator(value) : "";
			const message = resolveKey(rawKey);
			setErrors((prev) => ({...prev, [name]: message}));
			return message;
		},
		[resolveKey],
	);

	/**
	 * Validates all provided fields at once.
	 * @returns `true` when every field passes validation.
	 */
	const validateAll = useCallback(
		(fields: Record<string, string>): boolean => {
			const newErrors: FieldErrors = {};
			let allValid = true;

			for (const [name, value] of Object.entries(fields)) {
				const validator = VALIDATORS[name];
				if (!validator) continue;
				const rawKey = validator(value);
				const message = resolveKey(rawKey);
				newErrors[name] = message;
				if (message) allValid = false;
			}

			setErrors((prev) => ({...prev, ...newErrors}));
			return allValid;
		},
		[resolveKey],
	);

	const setFieldError = useCallback((name: string, error: string): void => {
		setErrors((prev) => ({...prev, [name]: error}));
	}, []);

	const clearErrors = useCallback((): void => {
		setErrors(emptyErrors);
	}, [emptyErrors]);

	// True only when no field has a non-empty error string.
	const isValid = Object.values(errors).every((e) => !e);

	return {
		errors,
		validate,
		validateAll,
		setFieldError,
		clearErrors,
		isValid,
	};
}
