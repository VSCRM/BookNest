import {useState} from "react";
import {Bookmark, BookmarkCheck, Trash2} from "lucide-react";
import {useLocale} from "../../i18n/LocaleContext";
import styles from "./BookCard.module.css";

interface CardActionsProps {
	isSaved: boolean;
	onSave: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

/** Save / unsave button. Shows a trash icon on hover when already saved. */
export function CardActions({isSaved, onSave}: CardActionsProps): React.ReactElement {
	const [isHovering, setIsHovering] = useState(false);
	const {t} = useLocale();

	const handleClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
		e.stopPropagation();
		onSave(e);
	};

	return (
		<div className={styles.actions}>
			<button
				className={
					isSaved ? `${styles.btnSave} ${styles.btnSaved}` : styles.btnSave
				}
				onClick={handleClick}
				onMouseEnter={() => setIsHovering(true)}
				onMouseLeave={() => setIsHovering(false)}
				aria-label={isSaved ? t.card.removeAriaLabel : t.card.saveAriaLabel}
			>
				{isSaved ? (
					isHovering ? (
						<Trash2 size={18} />
					) : (
						<BookmarkCheck size={18} />
					)
				) : (
					<Bookmark size={18} />
				)}
				{isSaved ? (isHovering ? t.card.remove : t.card.saved) : t.card.save}
			</button>
		</div>
	);
}
