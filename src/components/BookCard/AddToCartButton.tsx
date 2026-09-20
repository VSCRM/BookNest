import {useState} from "react";
import {ShoppingCart, Check} from "lucide-react";
import {useCart} from "../../hooks/useCart";
import {useLocale} from "../../i18n/LocaleContext";
import type {Book} from "../../schemas";
import styles from "./BookCard.module.css";

interface AddToCartButtonProps {
	book: Book;
}

/** Adds a book to the cart; briefly shows a checkmark as add-confirmation. */
export function AddToCartButton({book}: AddToCartButtonProps): React.ReactElement {
	const {addItem} = useCart();
	const {t} = useLocale();
	const [justAdded, setJustAdded] = useState(false);
	const outOfStock = book.stock !== undefined && book.stock <= 0;

	const handleClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
		e.preventDefault();
		e.stopPropagation();
		void addItem(book.id).then(() => {
			setJustAdded(true);
			setTimeout(() => setJustAdded(false), 1500);
		});
	};

	return (
		<span className={styles.addToCartWrap}>
			{!outOfStock && (
				<span className={styles.priceTooltip} aria-hidden="true">
					{book.price.toFixed(2)} грн
				</span>
			)}
			<button
				className={styles.btnAddToCart}
				onClick={handleClick}
				disabled={outOfStock}
				aria-label={t.card.addToCartAriaLabel(book.title)}
			>
				{justAdded ? (
					<Check size={16} aria-hidden="true" />
				) : (
					<ShoppingCart size={16} aria-hidden="true" />
				)}
				{outOfStock
					? t.card.outOfStock
					: justAdded
						? t.card.addedToCart
						: t.card.addToCart}
			</button>
		</span>
	);
}
