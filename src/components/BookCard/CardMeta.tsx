import {User} from "lucide-react";
import {Badge} from "../ui/Badge";
import styles from "./BookCard.module.css";

interface CardMetaProps {
	genre: string;
	author: string;
	price: number;
	publishedYear?: number;
}

/** Genre badge + author + year + price — the facts a shopper scans first. */
export function CardMeta({
	genre,
	author,
	price,
	publishedYear,
}: CardMetaProps): React.ReactElement {
	return (
		<div className={styles.meta}>
			<Badge label={genre} />
			<span className={styles.clockItem} aria-label={`Автор: ${author}`}>
				<User size={12} aria-hidden="true" />
				<span className={styles.authorText}>{author}</span>
			</span>
			{publishedYear && <span className={styles.year}>{publishedYear}</span>}
			<span className={styles.price}>{price.toFixed(2)} грн</span>
		</div>
	);
}
