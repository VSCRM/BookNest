import {Bookmark, BookmarkCheck} from "lucide-react";
import {useLocale} from "../../i18n/LocaleContext";
import styles from "./BookDetailPage.module.css";

interface SaveButtonProps {
	isSaved: boolean;
	onSave: () => void;
}

export function SaveButton({isSaved, onSave}: SaveButtonProps): React.ReactElement {
	const {t} = useLocale();

	return (
		<button
			className={`${styles.saveBtn} ${isSaved ? styles.saveBtnActive : ""}`}
			onClick={onSave}
			aria-pressed={isSaved}
		>
			{isSaved ? (
				<BookmarkCheck size={18} aria-hidden="true" />
			) : (
				<Bookmark size={18} aria-hidden="true" />
			)}
			{isSaved ? t.detail.saved : t.detail.save}
		</button>
	);
}
