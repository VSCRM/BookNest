import {useEffect, useState, useCallback} from "react";
import {Link} from "react-router";
import {PackageOpen} from "lucide-react";
import {orderService} from "../../services/orderService";
import {useLocale} from "../../i18n/LocaleContext";
import {Spinner} from "../../components/ui/Spinner";
import {ErrorState} from "../../components/ui/ErrorState";
import {ApiError} from "../../services/api";
import type {OrderSummary} from "../../schemas";
import styles from "./OrdersPage.module.css";

/** Order history: every order the signed-in user has placed. */
export function OrdersPage(): React.ReactElement {
	const {t} = useLocale();
	const [orders, setOrders] = useState<OrderSummary[] | null>(null);
	const [error, setError] = useState<string | null>(null);

	const load = useCallback(() => {
		setError(null);
		return orderService
			.getAll()
			.then((data) => {
				setOrders(data);
			})
			.catch((e: unknown) => {
				// A session-expiry 401 already triggers a global redirect to
				// /login (see api.ts) — showing our own error here too would
				// just flash confusing text for a moment before that
				// redirect happens, so skip it for that one case.
				if (e instanceof ApiError && e.isAuthExpired) return;
				setError(e instanceof Error ? e.message : "Failed to load orders");
			});
	}, []);

	useEffect(() => {
		void load();
	}, [load]);

	if (error) {
		return (
			<div className={styles.stateWrap}>
				<ErrorState detail={error} onRetry={load} />
			</div>
		);
	}

	if (!orders) {
		return (
			<div className={styles.stateWrap}>
				<Spinner size={32} label={t.orders.loading} />
			</div>
		);
	}

	if (orders.length === 0) {
		return (
			<div className={styles.empty}>
				<PackageOpen size={40} aria-hidden="true" />
				<p>{t.orders.empty}</p>
				<Link to="/" className={styles.browseLink}>
					{t.orders.browseLink}
				</Link>
			</div>
		);
	}

	return (
		<div className={styles.page}>
			<h1 className={styles.heading}>{t.orders.heading}</h1>
			<ul className={styles.list}>
				{orders.map((order) => (
					<li key={order.id} className={styles.row}>
						<div className={styles.info}>
							<span className={styles.number}>
								{t.orders.number} {order.number}
							</span>
							<span className={styles.meta}>
								{new Date(order.createdAt).toLocaleDateString()} ·{" "}
								{order.itemsCount} {t.orders.items}
							</span>
						</div>
						<span className={styles.status} data-status={order.status}>
							{order.status}
						</span>
						<span className={styles.total}>
							{order.totalPrice.toFixed(2)} грн
						</span>
						<Link to={`/orders/${order.id}`} className={styles.detailsBtn}>
							{t.orders.detailsBtn}
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
}
