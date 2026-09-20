import {z} from "zod";

/** A single line item in the cart, as returned by GET /api/v1/cart. */
export const CartItemSchema = z.object({
	bookId: z.number().int().positive(),
	title: z.string(),
	author: z.string(),
	price: z.number().nonnegative(),
	coverImageUrl: z.string().optional(),
	stock: z.number().int().optional(),
	quantity: z.number().int().positive(),
	subtotal: z.number().nonnegative(),
});

export type CartItem = z.infer<typeof CartItemSchema>;

/** Shape of the whole cart response. */
export const CartSchema = z.object({
	items: z.array(CartItemSchema),
	totalPrice: z.number().nonnegative(),
	totalItems: z.number().int().nonnegative(),
});

export type Cart = z.infer<typeof CartSchema>;
