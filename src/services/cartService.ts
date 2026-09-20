/**
 * Cart data service. Talks to the Rails JSON cart API (`/api/v1/cart`),
 * which works for both guests (cart keyed by a session cookie) and signed-in
 * users (cart keyed by their account) — no client-side branching needed,
 * the cookie already carries whichever identity applies.
 */
import {api} from "./api";
import {CartSchema} from "../schemas";
import type {Cart} from "../schemas";

/** Raw shape returned by Rails (snake_case). */
interface RailsCartItem {
	book_id: number;
	title: string;
	author: string;
	price: number | string;
	cover_image_url?: string | null;
	stock?: number | null;
	quantity: number;
	subtotal: number | string;
}

interface RailsCart {
	items: RailsCartItem[];
	total_price: number | string;
	total_items: number;
}

function mapCart(raw: RailsCart): unknown {
	return {
		items: raw.items.map((item) => ({
			bookId: item.book_id,
			title: item.title,
			author: item.author,
			price: Number(item.price),
			coverImageUrl: item.cover_image_url ?? undefined,
			stock: item.stock ?? undefined,
			quantity: item.quantity,
			subtotal: Number(item.subtotal),
		})),
		totalPrice: Number(raw.total_price),
		totalItems: raw.total_items,
	};
}

export const cartService = {
	async getCart(): Promise<Cart> {
		const {data} = await api.get<RailsCart>("/cart");
		return CartSchema.parse(mapCart(data));
	},

	async addItem(bookId: number, quantity = 1): Promise<Cart> {
		const {data} = await api.post<RailsCart>("/cart/items", {
			book_id: bookId,
			quantity,
		});
		return CartSchema.parse(mapCart(data));
	},

	async updateQuantity(bookId: number, quantity: number): Promise<Cart> {
		const {data} = await api.patch<RailsCart>(`/cart/items/${bookId}`, {quantity});
		return CartSchema.parse(mapCart(data));
	},

	async removeItem(bookId: number): Promise<Cart> {
		const {data} = await api.delete<RailsCart>(`/cart/items/${bookId}`);
		return CartSchema.parse(mapCart(data));
	},
};
