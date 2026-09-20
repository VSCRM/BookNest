import {Link} from "react-router";
import {useSaveBook} from "../../hooks/useSaveBook";
import type {Book} from "../../schemas";
import {CardImage} from "./CardImage";
import {CardMeta} from "./CardMeta";
import {CardTitle} from "./CardTitle";
import {CardActions} from "./CardActions";
import {AddToCartButton} from "./AddToCartButton";
import styles from "./BookCard.module.css";

interface BookCardProps {
	book: Book;
	featured?: boolean;
}

export function BookCard({book, featured = false}: BookCardProps): React.ReactElement {
	const {isSaved, handleSave} = useSaveBook(book);

	return (
		<article
			className={featured ? styles.cardFeatured : styles.card}
			data-testid="book-card"
		>
			<Link
				to={`/book/${book.id}`}
				className={styles.cardLink}
				aria-label={`Переглянути книгу: ${book.title}`}
			>
				<CardImage src={book.coverImageUrl} alt={book.title} />
				<CardMeta
					genre={book.genre}
					author={book.author}
					price={book.price}
					publishedYear={book.publishedYear}
				/>
				<CardTitle title={book.title} size={featured ? "32px" : "20px"} />
				<p className={styles.description}>{book.description}</p>
			</Link>
			<div className={styles.actionsRow}>
				<CardActions isSaved={isSaved} onSave={handleSave} />
				<AddToCartButton book={book} />
			</div>
		</article>
	);
}
