import {useEffect, useState} from "react";
import {Link, useParams} from "react-router";
import {orderService} from "../../services/orderService";
import {useLocale} from "../../i18n/LocaleContext";
import {BOOK_COVER_PLACEHOLDER} from "../../constants/bookPlaceholder";
import {Spinner} from "../../components/ui/Spinner";
import type {OrderDetail} from "../../schemas";
import styles from "./OrdersPage.module.css";

/** Single order confirmation / detail — also the page shown right after checkout. */
export function OrderDetailPage(): React.ReactElement {
	const {id} = useParams<{id: string}>();
	const {t} = useLocale();
	const [order, setOrder] = useState<OrderDetail | null>(null);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!id) return;
		let cancelled = false;
		orderService
			.getById(id)
			.then((data) => {
				if (!cancelled) setOrder(data);
			})
			.catch(() => {
				if (!cancelled) setError(t.orders.notFound);
			});
		return () => {
			cancelled = true;
		};
	}, [id, t.orders.notFound]);

	if (error) return <p className={styles.stateWrap}>{error}</p>;

	if (!order) {
		return (
			<div className={styles.stateWrap}>
				<Spinner size={32} label={t.cart.loading} />
			</div>
		);
	}

	return (
		<div className={styles.detailPage}>
			<Link to="/orders" className={styles.backLink}>
				{t.orders.backToOrders}
			</Link>

			<h1 className={styles.heading}>
				{t.orders.number} {order.number}
			</h1>
			<span className={styles.status} data-status={order.status}>
				{order.status}
			</span>
			<p className={styles.orderDate}>
				{new Date(order.createdAt).toLocaleString()}
			</p>

			<ul className={styles.detailList}>
				{order.items.map((item) => (
					<li key={item.bookId} className={styles.detailRow}>
						<img
							src={item.coverImageUrl ?? BOOK_COVER_PLACEHOLDER}
							alt={item.title}
							className={styles.detailCover}
						/>
						<div className={styles.info}>
							<span className={styles.title}>{item.title}</span>
							<span className={styles.meta}>
								{item.author} · {item.quantity} ×{" "}
								{item.unitPrice.toFixed(2)} грн
							</span>
						</div>
						<span className={styles.total}>
							{(item.quantity * item.unitPrice).toFixed(2)} грн
						</span>
					</li>
				))}
			</ul>

			<div className={styles.grandTotal}>
				{t.cart.total}: {order.totalPrice.toFixed(2)} грн
			</div>
		</div>
	);
}
