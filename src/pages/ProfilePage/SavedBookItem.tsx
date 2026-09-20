import {useNavigate} from "react-router";
import {Trash2} from "lucide-react";
import {useLocale} from "../../i18n/LocaleContext";
import type {Book} from "../../schemas";
import styles from "./SavedBooksList.module.css";

interface SavedBookItemProps {
	book: Book;
	onRemove: (id: number) => void;
}

export function SavedBookItem({book, onRemove}: SavedBookItemProps): React.ReactElement {
	const navigate = useNavigate();
	const {t} = useLocale();

	return (
		<li className={styles.item} data-testid="saved-book-item">
			<div
				className={styles.clickableArea}
				onClick={() => void navigate(`/book/${book.id}`)}
				role="button"
				tabIndex={0}
				onKeyDown={(e) => e.key === "Enter" && void navigate(`/book/${book.id}`)}
				aria-label={t.profile.readBook(book.title)}
			>
				<p className={styles.itemTitle}>{book.title}</p>
				<span className={styles.itemMeta}>
					{book.genre} • {book.author} • {book.price.toFixed(2)} грн
				</span>
			</div>
			<button
				className={styles.removeBtn}
				onClick={() => onRemove(book.id)}
				aria-label={t.profile.removeBook(book.title)}
			>
				<Trash2 size={18} />
			</button>
		</li>
	);
}
