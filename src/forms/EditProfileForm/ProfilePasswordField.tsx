/**
 * Optional password field for the edit-profile form.
 * Leaving it empty keeps the current password.
 */
import type {ChangeEvent} from "react";
import {PasswordInput} from "../shared/PasswordInput";
import {PasswordStrengthHint} from "../shared/PasswordStrengthHint";
import {useLocale} from "../../i18n/LocaleContext";

interface ProfilePasswordFieldProps {
	value: string;
	error?: string;
	onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export function ProfilePasswordField({
	value,
	error,
	onChange,
}: ProfilePasswordFieldProps): React.ReactElement {
	const {t} = useLocale();
	return (
		<>
			<PasswordInput
				name="password"
				placeholder={t.editProfile.placeholder.password}
				label={t.editProfile.passwordLabel}
				value={value}
				error={error}
				onChange={onChange}
				autoComplete="new-password"
			/>
			<PasswordStrengthHint password={value} />
		</>
	);
}
