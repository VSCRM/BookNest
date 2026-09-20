import {useCallback, useEffect, useMemo, useState, type ReactNode} from "react";
import {CartContext, type CartContextValue} from "./CartContext";
import {cartService} from "../services/cartService";
import type {Cart} from "../schemas";

/**
 * Owns the cart's client-side state and keeps it in sync with the Rails
 * cart API after every mutation. Works for guests and signed-in users
 * alike — see cartService's doc comment.
 */
export function CartProvider({children}: {children: ReactNode}): React.ReactElement {
	const [cart, setCart] = useState<Cart | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// Returns the freshly-fetched cart (not just void) so callers that need
	// to act on the *result* of a refresh — e.g. CartPage resuming a
	// checkout right after login — don't have to wait for this state
	// update to propagate back through context and re-render them first.
	// Relying on the `cart`/`loading` state for that is racy: this same
	// function also runs from the "booknest:auth-changed" listener below,
	// and effect ordering between that listener and a consumer's own
	// effect isn't guaranteed, so a consumer reading `loading` right after
	// mount can observe a stale "not loading" from *before* this refresh
	// started.
	const refresh = useCallback(async (): Promise<Cart | null> => {
		setLoading(true);
		setError(null);
		try {
			const fetched = await cartService.getCart();
			setCart(fetched);
			return fetched;
		} catch (e) {
			setError(e instanceof Error ? e.message : "Failed to load cart");
			return null;
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		void refresh();
	}, [refresh]);

	// The cart cookie/session and the auth cookie are two different
	// identities on two different backends (see AuthProvider). Re-fetch
	// whenever AuthProvider reports that the signed-in user actually changed
	// (login, logout, switching accounts), so `cart` always reflects the
	// account that's *currently* authenticated instead of a stale guest (or
	// previous user's) cart lingering in memory.
	useEffect(() => {
		const handleAuthChanged = (): void => {
			void refresh();
		};
		window.addEventListener("booknest:auth-changed", handleAuthChanged);
		return () =>
			window.removeEventListener("booknest:auth-changed", handleAuthChanged);
	}, [refresh]);

	const addItem = useCallback(async (bookId: number, quantity = 1) => {
		setError(null);
		try {
			setCart(await cartService.addItem(bookId, quantity));
		} catch (e) {
			setError(e instanceof Error ? e.message : "Failed to add item");
			throw e;
		}
	}, []);

	const updateQuantity = useCallback(async (bookId: number, quantity: number) => {
		setError(null);
		try {
			setCart(await cartService.updateQuantity(bookId, quantity));
		} catch (e) {
			setError(e instanceof Error ? e.message : "Failed to update quantity");
		}
	}, []);

	const removeItem = useCallback(async (bookId: number) => {
		setError(null);
		try {
			setCart(await cartService.removeItem(bookId));
		} catch (e) {
			setError(e instanceof Error ? e.message : "Failed to remove item");
		}
	}, []);

	const value: CartContextValue = useMemo(
		() => ({
			cart,
			loading,
			error,
			refresh,
			addItem,
			updateQuantity,
			removeItem,
		}),
		[cart, loading, error, refresh, addItem, updateQuantity, removeItem],
	);

	return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
