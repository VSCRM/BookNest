/**
 * Book data service — locale-aware.
 *
 * Mock implementation serves the bundled sample dataset from bookData.ts
 * (useful for `npm run dev` without the Rails backend running).
 * The real API implementation talks to the BookNest Rails backend
 * (`GET /api/v1/books`, `GET /api/v1/books/:id`) and maps its snake_case
 * JSON response onto the camelCase `Book` shape used throughout the UI.
 */
import config from "../config";
import {api} from "./api";
import {BooksArraySchema, BookSchema} from "../schemas";
import type {Book} from "../schemas";
import type {Locale} from "../i18n/translations";
import {MOCK_BOOKS_BY_LOCALE} from "../mock/bookData";

export interface BookService {
	getAll(signal?: AbortSignal, locale?: Locale): Promise<Book[]>;
	getById(
		id: string | number,
		signal?: AbortSignal,
		locale?: Locale,
	): Promise<Book | null>;
}

/** Raw shape returned by the Rails JSON API (snake_case, as ActiveRecord emits it). */
interface RailsBook {
	id: number;
	title: string;
	author: string;
	genre: string;
	price: number | string;
	description?: string | null;
	published_year?: number | null;
	pages?: number | null;
	stock?: number | null;
	cover_image_url?: string | null;
}

/** Converts a Rails API book payload into the camelCase `Book` the UI expects. */
function mapRailsBook(raw: RailsBook): unknown {
	return {
		id: raw.id,
		title: raw.title,
		author: raw.author,
		genre: raw.genre,
		price: typeof raw.price === "string" ? Number.parseFloat(raw.price) : raw.price,
		description: raw.description ?? undefined,
		publishedYear: raw.published_year ?? undefined,
		pages: raw.pages ?? undefined,
		stock: raw.stock ?? undefined,
		coverImageUrl: raw.cover_image_url ?? undefined,
	};
}

// ─── Mock implementation (bundled sample data, no backend required) ─────────

const mockBookService: BookService = {
	async getAll(_signal, locale = "uk"): Promise<Book[]> {
		return BooksArraySchema.parse(MOCK_BOOKS_BY_LOCALE[locale]);
	},
	async getById(id, _signal, locale = "uk"): Promise<Book | null> {
		const dataset = MOCK_BOOKS_BY_LOCALE[locale];
		const found = dataset.find((a) => a.id === Number(id));
		return found ? BookSchema.parse(found) : null;
	},
};

// ─── Real API implementation (BookNest Rails backend) ───────────────────────

const apiBookService: BookService = {
	async getAll(signal, locale = "uk"): Promise<Book[]> {
		const {data} = await api.get<RailsBook[]>("/books", {
			signal,
			params: {locale},
		});
		return BooksArraySchema.parse(data.map(mapRailsBook));
	},
	async getById(id, signal, locale = "uk"): Promise<Book | null> {
		try {
			const {data} = await api.get<RailsBook>(`/books/${id}`, {
				signal,
				params: {locale},
			});
			return BookSchema.parse(mapRailsBook(data));
		} catch {
			return null;
		}
	},
};

export const bookService: BookService = config.USE_MOCK
	? mockBookService
	: apiBookService;
