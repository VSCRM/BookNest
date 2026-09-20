import {LogOut, Bookmark} from "lucide-react";
import {useProfilePage} from "../../hooks/useProfilePage";
import {useAuth} from "../../hooks/useAuth";
import {useLocale} from "../../i18n/LocaleContext";
import {ProfileInfo} from "./ProfileInfo";
import {EditProfileForm} from "../../forms/EditProfileForm/EditProfileForm";
import {SavedBooksList} from "./SavedBooksList";
import {Toast} from "../../components/Toast/Toast";
import styles from "./ProfilePage.module.css";

export function ProfilePage(): React.ReactElement {
	const {savedBooks, unsaveBook, loading} = useAuth();
	const {t} = useLocale();
	const {
		user,
		editing,
		savedType,
		saveError,
		handleLogout,
		handleSave,
		toggleEditing,
		closeEditing,
	} = useProfilePage();

	return (
		<>
			{savedType && (
				<Toast message={t.profile.toast[savedType]} onClose={() => {}} />
			)}
			{saveError && <Toast message={saveError} onClose={() => {}} />}

			<div className={styles.card}>
				<ProfileInfo user={user} onEdit={toggleEditing} />

				{editing && (
					<EditProfileForm
						user={user}
						onSave={handleSave}
						onCancel={closeEditing}
						loading={loading}
					/>
				)}

				<button className={styles.logoutBtn} onClick={handleLogout}>
					<LogOut size={16} aria-hidden="true" /> {t.profile.logoutBtn}
				</button>
			</div>

			<div className={styles.savedSection}>
				<h3 className={styles.savedTitle}>
					<Bookmark size={18} aria-hidden="true" />
					{t.profile.savedHeading(savedBooks.length)}
				</h3>
				<SavedBooksList books={savedBooks} onRemove={unsaveBook} />
			</div>
		</>
	);
}
