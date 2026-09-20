/** Save / Cancel button row for the edit-profile form. */
import {Save, X, Loader2} from "lucide-react";
import {useLocale} from "../../i18n/LocaleContext";
import styles from "./EditProfileForm.module.css";

interface ProfileFormActionsProps {
	loading: boolean;
	isDisabled: boolean;
	onCancel: () => void;
}

export function ProfileFormActions({
	loading,
	isDisabled,
	onCancel,
}: ProfileFormActionsProps): React.ReactElement {
	const {t} = useLocale();
	return (
		<div className={styles.btnRow}>
			<button
				type="submit"
				className={`${styles.btn} ${styles.btnSave}`}
				disabled={isDisabled || loading}
				aria-busy={loading}
			>
				{loading ? (
					<Loader2 size={16} className={styles.spinner} aria-hidden="true" />
				) : (
					<Save size={16} aria-hidden="true" />
				)}
				{t.editProfile.saveBtn}
			</button>

			<button
				type="button"
				className={`${styles.btn} ${styles.btnCancel}`}
				onClick={onCancel}
			>
				<X size={16} aria-hidden="true" />
				{t.editProfile.cancelBtn}
			</button>
		</div>
	);
}
