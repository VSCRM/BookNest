import {useEditProfileForm} from "../../hooks/useEditProfileForm";
import {NicknameField} from "./NicknameField";
import {ProfilePasswordField} from "./ProfilePasswordField";
import {ProfileFormActions} from "./ProfileFormActions";
import {useLocale} from "../../i18n/LocaleContext";
import type {User} from "../../schemas";
import type {UpdateUserPayload} from "../../services/authService";
import styles from "./EditProfileForm.module.css";

interface EditProfileFormProps {
	user: User | null;
	onSave: (payload: UpdateUserPayload) => Promise<void>;
	onCancel: () => void;
	loading: boolean;
}

/** Edit-profile form. Both fields are optional — only changed fields are saved. */
export function EditProfileForm({
	user,
	onSave,
	onCancel,
	loading,
}: EditProfileFormProps): React.ReactElement {
	const {t} = useLocale();
	const {form, errors, isSubmitDisabled, handleChange, handleSubmit} =
		useEditProfileForm(user, onSave);

	return (
		<form
			className={styles.form}
			onSubmit={(e) => void handleSubmit(e)}
			noValidate
			aria-label={t.editProfile.formLabel}
		>
			<p className={styles.title}>{t.editProfile.title}</p>

			<NicknameField value={form.nickname} onChange={handleChange} />

			<ProfilePasswordField
				value={form.password}
				error={errors["password"]}
				onChange={handleChange}
			/>

			<ProfileFormActions
				loading={loading}
				isDisabled={isSubmitDisabled}
				onCancel={onCancel}
			/>
		</form>
	);
}
