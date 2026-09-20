import {User, Calendar, BookOpen, Tag} from "lucide-react";
import styles from "./BookDetailPage.module.css";

interface BookMetaProps {
	author?: string;
	publishedYear?: number;
	pages?: number;
	price: number;
}

/** Author, publication year, page count and price — the facts a buyer needs. */
export function BookMeta({
	author,
	publishedYear,
	pages,
	price,
}: BookMetaProps): React.ReactElement {
	return (
		<div className={styles.meta}>
			{author && (
				<span className={styles.metaItem}>
					<User size={14} aria-hidden="true" /> {author}
				</span>
			)}
			{publishedYear && (
				<span className={styles.metaItem}>
					<Calendar size={14} aria-hidden="true" /> {publishedYear}
				</span>
			)}
			{pages && (
				<span className={styles.metaItem}>
					<BookOpen size={14} aria-hidden="true" /> {pages} ст.
				</span>
			)}
			<span className={styles.metaItem}>
				<Tag size={14} aria-hidden="true" /> {price.toFixed(2)} грн
			</span>
		</div>
	);
}
