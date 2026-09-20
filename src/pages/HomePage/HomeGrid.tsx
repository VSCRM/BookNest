import {BookCard} from "../../components/BookCard/BookCard";
import type {Book} from "../../schemas";
import styles from "./HomePage.module.css";

interface HomeGridProps {
	books: Book[];
}

/** Responsive book grid — no list element to avoid browser bullet defaults. */
export function HomeGrid({books}: HomeGridProps): React.ReactElement {
	return (
		<div className={styles.grid}>
			{books.map((item) => (
				<BookCard key={item.id} book={item} />
			))}
		</div>
	);
}
