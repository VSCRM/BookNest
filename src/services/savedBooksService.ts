import config from "../config";
import {api} from "./api";
import {SavedBooksStorageSchema, BooksArraySchema, type Book} from "../schemas";

/**
 * Raw shape returned by the Rails JSON API for a saved book (snake_case, as
 * ActiveRecord emits it) — same convention as `RailsBook` in bookService.ts.
 */
interface RailsSavedBook {
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

/** Converts a Rails saved-book payload into the camelCase `Book` the UI expects. */
function mapRailsSavedBook(raw: RailsSavedBook): unknown {
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

/** Contract for saved-books CRUD operations. */
export interface SavedBooksService {
	getAll(username: string): Promise<Book[]>;
	save(username: string, book: Book): Promise<void>;
	remove(username: string, bookId: number): Promise<void>;
}

// ─── Mock implementation (localStorage) ──────────────────────────────────────

const mockService: SavedBooksService = {
	async getAll(username: string): Promise<Book[]> {
		try {
			const raw = localStorage.getItem(`bp_saved_${username}`);
			if (!raw) return [];
			const parsed: unknown = JSON.parse(raw);
			const result = SavedBooksStorageSchema.safeParse(parsed);
			return result.success ? result.data : [];
		} catch {
			return [];
		}
	},

	// In mock mode persistence is driven by useAuthSync writing to localStorage.
	async save(): Promise<void> {
		/* no-op */
	},
	async remove(): Promise<void> {
		/* no-op */
	},
};

// ─── Real API implementation (Axios) ─────────────────────────────────────────

const apiService: SavedBooksService = {
	/**
	 * GET /users/:username/saved
	 * Like `/books`, Rails serializes this in snake_case (cover_image_url,
	 * published_year, price as a numeric string) — it has to be mapped to the
	 * camelCase `Book` shape *before* validation, the same way bookService
	 * does for the catalog. Skipping that mapping (as this used to) means
	 * `price` arrives as a string where BookSchema requires a number, so
	 * every response fails validation and is dropped by the empty-array
	 * fallbacks in useLogin/useAuthSync/AuthProvider — saved books were
	 * genuinely persisted on the server the whole time, they just never
	 * survived the client-side parse to make it back into the UI.
	 */
	async getAll(username: string): Promise<Book[]> {
		const {data} = await api.get<RailsSavedBook[]>(`/users/${username}/saved`);
		return BooksArraySchema.parse(data.map(mapRailsSavedBook));
	},

	async save(username: string, book: Book): Promise<void> {
		// Rails only needs the id to associate the book with this user's
		// saved list (matches cartService's addItem payload convention).
		await api.post(`/users/${username}/saved`, {book_id: book.id});
	},

	async remove(username: string, bookId: number): Promise<void> {
		await api.delete(`/users/${username}/saved/${bookId}`);
	},
};

export const savedBooksService: SavedBooksService = config.USE_MOCK
	? mockService
	: apiService;
