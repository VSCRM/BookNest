import {SavedBooksEmpty} from "./SavedBooksEmpty";
import {SavedBookItem} from "./SavedBookItem";
import type {Book} from "../../schemas";
import styles from "./SavedBooksList.module.css";

interface SavedBooksListProps {
	books: Book[];
	onRemove: (id: number) => void;
}

export function SavedBooksList({
	books,
	onRemove,
}: SavedBooksListProps): React.ReactElement {
	if (!books.length) return <SavedBooksEmpty />;
	return (
		<ul className={styles.list}>
			{books.map((book) => (
				<SavedBookItem key={book.id} book={book} onRemove={onRemove} />
			))}
		</ul>
	);
}
