/**
 * Admin catalog-management service — backs the "Add book" tab shown only to
 * `user.role === 'admin'` (see pages/AdminBooksPage).
 *
 * Real implementation talks to `Api::V1::Admin::BooksController`
 * (`GET/POST /api/v1/admin/books`, `PATCH/DELETE /api/v1/admin/books/:id`),
 * which requires both the Ukrainian and English fields to be filled in
 * (Book model's `on: :admin_write` validations) and accepts either an
 * uploaded cover file or a plain `cover_image_url`.
 *
 * Mock implementation persists to localStorage so the panel is fully
 * usable in `VITE_USE_MOCK=true` dev mode without the Rails backend.
 */
import config from "../config";
import {api} from "./api";

/** Full bilingual book record as edited by the admin panel. */
export interface AdminBook {
	id: number;
	title: string;
	titleEn: string;
	author: string;
	authorEn: string;
	genre: string;
	genreEn: string;
	description: string;
	descriptionEn: string;
	price: number;
	pages?: number;
	publishedYear?: number;
	stock: number;
	coverImageUrl?: string;
}

/** Payload for create/update — everything but `id`, plus the optional cover file. */
export interface AdminBookInput {
	title: string;
	titleEn: string;
	author: string;
	authorEn: string;
	genre: string;
	genreEn: string;
	description: string;
	descriptionEn: string;
	price: number;
	pages?: number;
	publishedYear?: number;
	stock: number;
	/** A newly-picked file to upload as the cover. Omit to leave the cover unchanged. */
	coverImageFile?: File | null;
	/** Clears an existing cover back to the frontend's default placeholder. */
	removeCoverImage?: boolean;
}

export interface AdminBooksService {
	getAll(): Promise<AdminBook[]>;
	create(input: AdminBookInput): Promise<AdminBook>;
	update(id: number, input: AdminBookInput): Promise<AdminBook>;
	remove(id: number): Promise<void>;
}

/** Raw shape returned by Api::V1::Admin::BooksController#full_json. */
interface RailsAdminBook {
	id: number;
	title: string;
	title_en: string | null;
	author: string;
	author_en: string | null;
	price: number | string;
	genre: string;
	genre_en: string | null;
	stock: number;
	published_year: number | null;
	description: string | null;
	description_en: string | null;
	pages: number | null;
	cover_image_url: string | null;
}

function mapRailsAdminBook(raw: RailsAdminBook): AdminBook {
	return {
		id: raw.id,
		title: raw.title,
		titleEn: raw.title_en ?? "",
		author: raw.author,
		authorEn: raw.author_en ?? "",
		genre: raw.genre,
		genreEn: raw.genre_en ?? "",
		description: raw.description ?? "",
		descriptionEn: raw.description_en ?? "",
		price: typeof raw.price === "string" ? Number.parseFloat(raw.price) : raw.price,
		pages: raw.pages ?? undefined,
		publishedYear: raw.published_year ?? undefined,
		stock: raw.stock,
		coverImageUrl: raw.cover_image_url ?? undefined,
	};
}

/** Builds the multipart `book[...]` payload Rails' strong params expect. */
function toFormData(input: AdminBookInput): FormData {
	const form = new FormData();
	form.append("book[title]", input.title);
	form.append("book[title_en]", input.titleEn);
	form.append("book[author]", input.author);
	form.append("book[author_en]", input.authorEn);
	form.append("book[genre]", input.genre);
	form.append("book[genre_en]", input.genreEn);
	form.append("book[description]", input.description);
	form.append("book[description_en]", input.descriptionEn);
	form.append("book[price]", String(input.price));
	form.append("book[stock]", String(input.stock));
	if (input.pages !== undefined) form.append("book[pages]", String(input.pages));
	if (input.publishedYear !== undefined) {
		form.append("book[published_year]", String(input.publishedYear));
	}
	if (input.coverImageFile) {
		form.append("book[cover_image]", input.coverImageFile);
	} else if (input.removeCoverImage) {
		form.append("book[remove_cover_image]", "true");
	}
	return form;
}

// ─── Real API implementation (BookNest Rails backend) ───────────────────────

const apiAdminBooksService: AdminBooksService = {
	async getAll(): Promise<AdminBook[]> {
		const {data} = await api.get<RailsAdminBook[]>("/admin/books");
		return data.map(mapRailsAdminBook);
	},

	async create(input: AdminBookInput): Promise<AdminBook> {
		// `Content-Type: undefined` clears the instance's default
		// `application/json` header so the browser/axios sets
		// `multipart/form-data; boundary=...` itself. Setting the literal
		// string "multipart/form-data" here instead would send the request
		// without a boundary param and Rails would fail to parse it.
		const {data} = await api.post<RailsAdminBook>("/admin/books", toFormData(input), {
			headers: {"Content-Type": undefined},
		});
		return mapRailsAdminBook(data);
	},

	async update(id: number, input: AdminBookInput): Promise<AdminBook> {
		const {data} = await api.patch<RailsAdminBook>(
			`/admin/books/${id}`,
			toFormData(input),
			{headers: {"Content-Type": undefined}},
		);
		return mapRailsAdminBook(data);
	},

	async remove(id: number): Promise<void> {
		await api.delete(`/admin/books/${id}`);
	},
};

// ─── Mock implementation (localStorage, for VITE_USE_MOCK=true) ─────────────

const MOCK_KEY = "bp_admin_books";

function readMockCatalog(): AdminBook[] {
	try {
		const raw = localStorage.getItem(MOCK_KEY);
		if (!raw) return [];
		const parsed: unknown = JSON.parse(raw);
		return Array.isArray(parsed) ? (parsed as AdminBook[]) : [];
	} catch {
		return [];
	}
}

function writeMockCatalog(books: AdminBook[]): void {
	localStorage.setItem(MOCK_KEY, JSON.stringify(books));
}

function nextMockId(books: AdminBook[]): number {
	return books.reduce((max, book) => Math.max(max, book.id), 0) + 1;
}

const mockAdminBooksService: AdminBooksService = {
	async getAll(): Promise<AdminBook[]> {
		return readMockCatalog();
	},

	async create(input: AdminBookInput): Promise<AdminBook> {
		const books = readMockCatalog();
		const book: AdminBook = {
			id: nextMockId(books),
			title: input.title,
			titleEn: input.titleEn,
			author: input.author,
			authorEn: input.authorEn,
			genre: input.genre,
			genreEn: input.genreEn,
			description: input.description,
			descriptionEn: input.descriptionEn,
			price: input.price,
			pages: input.pages,
			publishedYear: input.publishedYear,
			stock: input.stock,
			coverImageUrl: input.coverImageFile
				? URL.createObjectURL(input.coverImageFile)
				: undefined,
		};
		writeMockCatalog([...books, book]);
		return book;
	},

	async update(id: number, input: AdminBookInput): Promise<AdminBook> {
		const books = readMockCatalog();
		const existing = books.find((b) => b.id === id);
		const coverImageUrl = input.coverImageFile
			? URL.createObjectURL(input.coverImageFile)
			: input.removeCoverImage
				? undefined
				: existing?.coverImageUrl;
		const updated: AdminBook = {
			id,
			title: input.title,
			titleEn: input.titleEn,
			author: input.author,
			authorEn: input.authorEn,
			genre: input.genre,
			genreEn: input.genreEn,
			description: input.description,
			descriptionEn: input.descriptionEn,
			price: input.price,
			pages: input.pages,
			publishedYear: input.publishedYear,
			stock: input.stock,
			coverImageUrl,
		};
		writeMockCatalog(books.map((b) => (b.id === id ? updated : b)));
		return updated;
	},

	async remove(id: number): Promise<void> {
		writeMockCatalog(readMockCatalog().filter((b) => b.id !== id));
	},
};

export const adminBooksService: AdminBooksService = config.USE_MOCK
	? mockAdminBooksService
	: apiAdminBooksService;
