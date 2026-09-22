import {useCallback, useEffect, useRef, useState} from "react";
import {useNavigate, useLocation} from "react-router";
import {ShoppingBag, Minus, Plus, Trash2} from "lucide-react";
import {useCart} from "../../hooks/useCart";
import {useAuth} from "../../hooks/useAuth";
import {useLocale} from "../../i18n/LocaleContext";
import {BOOK_COVER_PLACEHOLDER} from "../../constants/bookPlaceholder";
import {orderService} from "../../services/orderService";
import {ApiError} from "../../services/api";
import {Spinner} from "../../components/ui/Spinner";
import {ErrorState} from "../../components/ui/ErrorState";
import styles from "./CartPage.module.css";

/**
 * Set right before we bounce an unauthenticated checkout attempt to
 * /login, and cleared once we're back here — lets this page tell "just
 * landed here normally" apart from "landed here after being sent to log
 * in mid-checkout", so it knows to finish the order automatically instead
 * of silently dropping it.
 */
const PENDING_CHECKOUT_KEY = "booknest:pendingCheckout";

/**
 * Snapshot of what was actually in the cart at the moment we bounced to
 * /login, as plain {bookId, quantity} pairs. The cart is server-side and
 * keyed by cookie — the guest session cookie and the signed-in account are
 * two different identities on two different backends (see AuthProvider /
 * CartProvider), so there's no guarantee the account we land back on
 * already has these items. Without this snapshot, "log in to check out"
 * silently lost whatever the person was buying whenever the account cart
 * didn't already contain it.
 */
const PENDING_CART_ITEMS_KEY = "booknest:pendingCartItems";

interface PendingCartItem {
	bookId: number;
	quantity: number;
}

/** Cart page: line items with quantity controls, running total, checkout. */
export function CartPage(): React.ReactElement {
	const {cart, loading, error, refresh, addItem, updateQuantity, removeItem} =
		useCart();
	const {user} = useAuth();
	const {t} = useLocale();
	const navigate = useNavigate();
	const location = useLocation();
	const [checkingOut, setCheckingOut] = useState(false);
	const [checkoutError, setCheckoutError] = useState<string | null>(null);
	// Guards the auto-retry effect below so it fires at most once per visit,
	// even though `cart`/`user` can each change more than once as things load.
	const autoRetried = useRef(false);

	const handleCheckout = useCallback(async () => {
		setCheckingOut(true);
		setCheckoutError(null);
		try {
			const order = await orderService.checkout();
			sessionStorage.removeItem(PENDING_CHECKOUT_KEY);
			// The server empties the cart as part of placing the order, but the
			// CartProvider's local `cart` state was never told that — it only
			// re-fetches on mount (see CartProvider.refresh's useEffect deps).
			// Without this, navigating back to /cart later in the same session
			// kept showing the pre-checkout items because nothing ever
			// invalidated the stale client-side cache.
			await refresh();
			navigate(`/orders/${order.id}`);
		} catch (e) {
			// Not signed in — POST /orders 401s, and (see api.ts's refresh
			// interceptor) a guest has no refresh cookie either, so the
			// silent-refresh attempt fails too and the error comes back
			// tagged isAuthExpired. Previously this just surfaced as an
			// inline error message with no way forward: the person had to
			// notice it, manually click "log in" in the header, and land on
			// /profile afterwards with the order they were placing (and
			// often the cart itself, once the session identity underneath
			// them changes) gone without a trace. Now we send them to log in
			// ourselves, remember that a checkout was in flight, and finish
			// it automatically once they're back.
			if (e instanceof ApiError && (e.status === 401 || e.isAuthExpired)) {
				sessionStorage.setItem(PENDING_CHECKOUT_KEY, "1");
				if (cart) {
					const snapshot: PendingCartItem[] = cart.items.map((item) => ({
						bookId: item.bookId,
						quantity: item.quantity,
					}));
					sessionStorage.setItem(
						PENDING_CART_ITEMS_KEY,
						JSON.stringify(snapshot),
					);
				}
				navigate("/login", {state: {from: location}});
				return;
			}
			setCheckoutError(e instanceof Error ? e.message : t.cart.checkoutError);
		} finally {
			setCheckingOut(false);
		}
	}, [navigate, location, cart, t.cart.checkoutError]);

	// Re-adds whatever was snapshotted before the login redirect into the
	// (now authenticated) account cart, then finishes the checkout. Runs
	// instead of jumping straight to handleCheckout so items survive even
	// when the account we land on doesn't already have them server-side.
	//
	// Explicitly re-fetches the cart itself (rather than trusting the
	// `cart` already sitting in context) before comparing against the
	// snapshot. CartProvider *also* refreshes on its own in response to
	// the "booknest:auth-changed" event once `user` changes, but that
	// listener lives on a component above this page, and there's no
	// guarantee it runs — let alone finishes its fetch — before this page's
	// own effect fires after the post-login navigation. Without this,
	// `cart` here could still be the stale pre-login (guest) cart, which
	// made the diff below wrongly think the pending items were already
	// present and skip re-adding them, so checkout silently went through
	// against whatever the new account's cart actually had (often empty).
	const resumeAfterLogin = useCallback(async () => {
		const raw = sessionStorage.getItem(PENDING_CART_ITEMS_KEY);
		sessionStorage.removeItem(PENDING_CART_ITEMS_KEY);

		const freshCart = await refresh();

		if (raw) {
			try {
				const pendingItems = JSON.parse(raw) as PendingCartItem[];
				const currentByBookId = new Map(
					(freshCart?.items ?? []).map((item) => [item.bookId, item.quantity]),
				);
				for (const item of pendingItems) {
					const existingQty = currentByBookId.get(item.bookId);
					if (existingQty === undefined) {
						await addItem(item.bookId, item.quantity);
					} else if (existingQty !== item.quantity) {
						await updateQuantity(item.bookId, item.quantity);
					}
				}
			} catch {
				// Malformed/corrupt snapshot — nothing to restore. Fall through
				// and check out with whatever the account cart already has.
			}
		}

		void handleCheckout();
	}, [refresh, addItem, updateQuantity, handleCheckout]);

	// Finish an order that was interrupted by a login redirect. Fires once
	// per visit, as soon as we know who the user is — resumeAfterLogin
	// itself is responsible for waiting on a fresh cart fetch before doing
	// anything with cart contents (see its comment above).
	useEffect(() => {
		if (
			!autoRetried.current &&
			user &&
			sessionStorage.getItem(PENDING_CHECKOUT_KEY)
		) {
			autoRetried.current = true;
			sessionStorage.removeItem(PENDING_CHECKOUT_KEY);
			void resumeAfterLogin();
		}
	}, [user, resumeAfterLogin]);

	if (loading) {
		return (
			<div className={styles.stateWrap}>
				<Spinner size={32} label={t.cart.loading} />
			</div>
		);
	}

	if (error) {
		return (
			<div className={styles.stateWrap}>
				<ErrorState
					detail={error}
					onRetry={() => {
						void refresh();
					}}
				/>
			</div>
		);
	}

	if (!cart || cart.items.length === 0) {
		return (
			<div className={styles.empty}>
				<ShoppingBag size={40} aria-hidden="true" />
				<p>{t.cart.empty}</p>
			</div>
		);
	}

	return (
		<div className={styles.page}>
			<h1 className={styles.heading}>{t.cart.heading}</h1>

			<ul className={styles.list}>
				{cart.items.map((item) => (
					<li key={item.bookId} className={styles.row}>
						<img
							src={item.coverImageUrl ?? BOOK_COVER_PLACEHOLDER}
							alt={item.title}
							className={styles.cover}
						/>
						<div className={styles.info}>
							<span className={styles.title}>{item.title}</span>
							<span className={styles.author}>{item.author}</span>
							<span className={styles.price}>
								{item.price.toFixed(2)} грн
							</span>
						</div>
						<div className={styles.qtyControl}>
							<button
								type="button"
								aria-label={t.cart.decreaseAria}
								onClick={() =>
									void updateQuantity(item.bookId, item.quantity - 1)
								}
							>
								<Minus size={14} aria-hidden="true" />
							</button>
							<span>{item.quantity}</span>
							<button
								type="button"
								aria-label={t.cart.increaseAria}
								onClick={() =>
									void updateQuantity(item.bookId, item.quantity + 1)
								}
							>
								<Plus size={14} aria-hidden="true" />
							</button>
						</div>
						<span className={styles.subtotal}>
							{item.subtotal.toFixed(2)} грн
						</span>
						<button
							type="button"
							className={styles.removeBtn}
							aria-label={t.cart.removeAria(item.title)}
							onClick={() => void removeItem(item.bookId)}
						>
							<Trash2 size={16} aria-hidden="true" />
						</button>
					</li>
				))}
			</ul>

			<div className={styles.summary}>
				<span className={styles.total}>
					{t.cart.total}: {cart.totalPrice.toFixed(2)} грн
				</span>
				{checkoutError && <p className={styles.checkoutError}>{checkoutError}</p>}
				<button
					className={styles.checkoutBtn}
					onClick={handleCheckout}
					disabled={checkingOut}
				>
					{checkingOut ? t.cart.placingOrder : t.cart.checkoutBtn}
				</button>
			</div>
		</div>
	);
}
