import {useContext} from "react";
import {CartContext} from "../context/CartContext";

/** Access the shared cart state. Must be used within a <CartProvider>. */
export function useCart() {
	const ctx = useContext(CartContext);
	if (!ctx) throw new Error("useCart must be used within a CartProvider");
	return ctx;
}
