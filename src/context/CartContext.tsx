import {createContext} from "react";
import type {Cart} from "../schemas";

export interface CartContextValue {
	cart: Cart | null;
	loading: boolean;
	error: string | null;
	refresh: () => Promise<Cart | null>;
	addItem: (bookId: number, quantity?: number) => Promise<void>;
	updateQuantity: (bookId: number, quantity: number) => Promise<void>;
	removeItem: (bookId: number) => Promise<void>;
}

export const CartContext = createContext<CartContextValue | undefined>(undefined);
