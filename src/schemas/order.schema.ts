import {z} from "zod";

/** A single book line inside an order (price is frozen at purchase time). */
export const OrderItemSchema = z.object({
	bookId: z.number().int().positive(),
	title: z.string(),
	author: z.string(),
	coverImageUrl: z.string().optional(),
	quantity: z.number().int().positive(),
	unitPrice: z.number().nonnegative(),
});

export type OrderItem = z.infer<typeof OrderItemSchema>;

/** Order summary row, as returned by GET /api/v1/orders (order history list). */
export const OrderSummarySchema = z.object({
	id: z.number().int().positive(),
	number: z.string(),
	status: z.string(),
	totalPrice: z.number().nonnegative(),
	itemsCount: z.number().int().nonnegative(),
	createdAt: z.string(),
});

export type OrderSummary = z.infer<typeof OrderSummarySchema>;

/** Full order detail, as returned by GET/POST /api/v1/orders/:id. */
export const OrderDetailSchema = OrderSummarySchema.omit({itemsCount: true}).extend({
	items: z.array(OrderItemSchema),
});

export type OrderDetail = z.infer<typeof OrderDetailSchema>;
