/** Nickname input for the edit-profile form. */
import type {ChangeEvent} from "react";
import {FormInput} from "../shared/FormInput";
import {useLocale} from "../../i18n/LocaleContext";

interface NicknameFieldProps {
	value: string;
	onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export function NicknameField({value, onChange}: NicknameFieldProps): React.ReactElement {
	const {t} = useLocale();
	return (
		<FormInput
			name="nickname"
			placeholder={t.editProfile.placeholder.nickname}
			label={t.editProfile.nicknameLabel}
			value={value}
			onChange={onChange}
			autoComplete="off"
		/>
	);
}
