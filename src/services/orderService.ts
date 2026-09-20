/** Order data service — checkout and order-history, via the Rails JSON API. */
import {api} from "./api";
import {OrderSummarySchema, OrderDetailSchema} from "../schemas";
import type {OrderSummary, OrderDetail} from "../schemas";

interface RailsOrderItem {
	book_id: number;
	title: string;
	author: string;
	cover_image_url?: string | null;
	quantity: number;
	unit_price: number | string;
}

interface RailsOrderSummary {
	id: number;
	number: string;
	status: string;
	total_price: number | string;
	items_count: number;
	created_at: string;
}

interface RailsOrderDetail extends Omit<RailsOrderSummary, "items_count"> {
	items: RailsOrderItem[];
}

function mapSummary(raw: RailsOrderSummary): unknown {
	return {
		id: raw.id,
		number: raw.number,
		status: raw.status,
		totalPrice: Number(raw.total_price),
		itemsCount: raw.items_count,
		createdAt: raw.created_at,
	};
}

function mapDetail(raw: RailsOrderDetail): unknown {
	return {
		id: raw.id,
		number: raw.number,
		status: raw.status,
		totalPrice: Number(raw.total_price),
		createdAt: raw.created_at,
		items: raw.items.map((item) => ({
			bookId: item.book_id,
			title: item.title,
			author: item.author,
			coverImageUrl: item.cover_image_url ?? undefined,
			quantity: item.quantity,
			unitPrice: Number(item.unit_price),
		})),
	};
}

export const orderService = {
	async getAll(): Promise<OrderSummary[]> {
		const {data} = await api.get<RailsOrderSummary[]>("/orders");
		return data.map((o) => OrderSummarySchema.parse(mapSummary(o)));
	},

	async getById(id: number | string): Promise<OrderDetail> {
		const {data} = await api.get<RailsOrderDetail>(`/orders/${id}`);
		return OrderDetailSchema.parse(mapDetail(data));
	},

	async checkout(): Promise<OrderDetail> {
		const {data} = await api.post<RailsOrderDetail>("/orders");
		return OrderDetailSchema.parse(mapDetail(data));
	},
};
