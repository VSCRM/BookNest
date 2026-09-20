import {describe, it, expect} from "vitest";
import {renderHook} from "@testing-library/react";
import {useCart} from "./useCart";
import {CartContext, type CartContextValue} from "../context/CartContext";

describe("useCart", () => {
	it("throws when used outside a CartProvider", () => {
		expect(() => renderHook(() => useCart())).toThrow(
			"useCart must be used within a CartProvider",
		);
	});

	it("returns the provided context value when used inside a CartProvider", () => {
		const value: CartContextValue = {
			cart: null,
			loading: false,
			error: null,
			refresh: async () => null,
			addItem: async () => {},
			updateQuantity: async () => {},
			removeItem: async () => {},
		};

		const {result} = renderHook(() => useCart(), {
			wrapper: ({children}) => (
				<CartContext.Provider value={value}>{children}</CartContext.Provider>
			),
		});

		expect(result.current).toBe(value);
	});
});
