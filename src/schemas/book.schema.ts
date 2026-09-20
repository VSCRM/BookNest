import {z} from "zod";

/**
 * Runtime schema for a single catalog book, matching the JSON shape
 * returned by the Rails API (`GET /api/v1/books`, `GET /api/v1/books/:id`).
 * All optional fields default to undefined so partial API responses are
 * tolerated rather than rejected outright.
 */
export const BookSchema = z.object({
	id: z.number().int().positive(),
	title: z.string().min(1),
	author: z.string().min(1),
	genre: z.string().min(1),
	price: z.number().nonnegative(),
	/** Full synopsis — present on both list and detail endpoints. */
	description: z.string().optional(),
	publishedYear: z.number().int().optional(),
	pages: z.number().int().optional(),
	stock: z.number().int().nonnegative().optional(),
	coverImageUrl: z.string().url().optional(),
	featured: z.boolean().optional(),
});

/** TypeScript type derived from BookSchema — the single source of truth. */
export type Book = z.infer<typeof BookSchema>;

/** Schema for a validated array of books (used with API list responses). */
export const BooksArraySchema = z.array(BookSchema);
