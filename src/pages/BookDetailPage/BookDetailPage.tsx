import {useBookDetail} from "../../hooks/useBookDetail";
import {BOOK_COVER_PLACEHOLDER} from "../../constants/bookPlaceholder";
import {DetailLoading} from "./DetailLoading";
import {DetailNotFound} from "./DetailNotFound";
import {SaveButton} from "./SaveButton";
import {BookMeta} from "./BookMeta";
import {BookLayout} from "../../components/BookLayout/BookLayout";
import {AddToCartButton} from "../../components/BookCard/AddToCartButton";
import {Badge} from "../../components/ui/Badge";
import styles from "./BookDetailPage.module.css";

export function BookDetailPage(): React.ReactElement {
	const {book, loading, error, isSaved, handleSave} = useBookDetail();

	if (loading) return <DetailLoading />;
	if (error || !book) return <DetailNotFound />;

	return (
		<BookLayout>
			<img
				src={book.coverImageUrl ?? BOOK_COVER_PLACEHOLDER}
				alt={book.title}
				className={styles.heroImg}
			/>

			<div className={styles.topRow}>
				<Badge label={book.genre} />
				<SaveButton isSaved={isSaved} onSave={handleSave} />
			</div>

			<h1 className={styles.title}>{book.title}</h1>

			<BookMeta
				author={book.author}
				publishedYear={book.publishedYear}
				pages={book.pages}
				price={book.price}
			/>

			<div className={styles.addToCartRow}>
				<AddToCartButton book={book} />
			</div>

			<div className={styles.body}>
				<p className={styles.lead}>{book.description}</p>
			</div>
		</BookLayout>
	);
}
