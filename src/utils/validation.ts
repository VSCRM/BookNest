/**
 * Pure field-level validators used by form hooks and Zod utilities.
 *
 * Every validator returns an empty string on success and a translated error
 * key string on failure. The actual display text comes from the i18n system
 * (useLocale / t.validation.*). Validators are locale-agnostic so they can
 * be reused across both languages.
 *
 * Internal helpers (regex constants) are not exported to keep the public API
 * surface minimal.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const HAS_UPPER = /[A-Z]/;
const HAS_DIGIT = /[0-9]/;
const HAS_NON_ASCII = /[\u0080-\uFFFF]/;

/** Returns a translation key or '' for a valid email address. */
export function validateEmail(value: string): string {
	if (!value) return "required";
	if (!EMAIL_RE.test(value)) return "invalidEmail";
	if (value.length > 254) return "emailTooLong";
	return "";
}

/** Returns a translation key or '' for a valid display nickname. */
export function validateNickname(value: string): string {
	if (!value) return "required";
	if (value.length < 2) return "minNickname";
	if (value.length > 32) return "maxNickname";
	return "";
}

/** Returns a translation key or '' for a password meeting all requirements. */
export function validatePassword(value: string): string {
	if (!value) return "required";
	if (value.length < 6) return "minPassword";
	if (HAS_NON_ASCII.test(value)) return "latinOnly";
	if (!HAS_UPPER.test(value)) return "passwordUpper";
	if (!HAS_DIGIT.test(value)) return "passwordDigit";
	return "";
}

/**
 * Same rules as validatePassword but accepts an empty string as valid.
 * Used for the optional password field in the profile-edit form.
 */
export function validatePasswordOptional(value: string): string {
	if (!value) return "";
	return validatePassword(value);
}

/** Strength levels for the password-strength hint component. */
export type PasswordStrengthLevel = "weak" | "medium" | "strong";

export interface PasswordStrength {
	level: PasswordStrengthLevel;
	/** Translation key resolved by the caller via t.passwordStrength[level]. */
	labelKey: PasswordStrengthLevel;
}

/**
 * Computes a password-strength descriptor.
 * Returns `null` when the value is empty (nothing to display).
 *
 * The `labelKey` field maps directly to keys in `t.passwordStrength` so that
 * the component can render the label in the active language.
 */
export function getPasswordStrength(value: string): PasswordStrength | null {
	if (!value) return null;
	if (HAS_NON_ASCII.test(value)) return {level: "weak", labelKey: "weak"};

	let score = 0;
	if (value.length >= 6) score++;
	if (value.length >= 10) score++;
	if (HAS_UPPER.test(value)) score++;
	if (HAS_DIGIT.test(value)) score++;
	if (/[^a-zA-Z0-9]/.test(value)) score++;

	if (score <= 1) return {level: "weak", labelKey: "weak"};
	if (score <= 3) return {level: "medium", labelKey: "medium"};
	return {level: "strong", labelKey: "strong"};
}

/** Lookup table used by useValidation to dispatch to the right validator. */
export const VALIDATORS: Record<string, (value: string) => string> = {
	email: validateEmail,
	nickname: validateNickname,
	password: validatePassword,
};
