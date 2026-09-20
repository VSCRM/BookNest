import {describe, it, expect} from "vitest";
import {
	BookSchema,
	BooksArraySchema,
	UserSchema,
	StoredUserSchema,
	AuthResultSchema,
	AuthSuccessSchema,
	AuthFailureSchema,
	ForgotPasswordResultSchema,
	SavedBooksStorageSchema,
	PendingBookStorageSchema,
	RateLimitRecordSchema,
	ResetRecordSchema,
	SortOrderSchema,
	CartItemSchema,
	CartSchema,
	OrderItemSchema,
	OrderSummarySchema,
	OrderDetailSchema,
} from "./index";

// ─── Book schema ────────────────────────────────────────────────────────────

describe("BookSchema", () => {
	const valid = {
		id: 1,
		title: "Test",
		author: "Jane Doe",
		genre: "Фентезі",
		price: 199,
	};

	it("accepts a minimal valid book", () => {
		expect(BookSchema.safeParse(valid).success).toBe(true);
	});

	it("accepts a book with all optional fields", () => {
		const full = {
			...valid,
			description: "Full synopsis",
			publishedYear: 2020,
			pages: 320,
			stock: 5,
			coverImageUrl: "https://example.com/img.jpg",
			featured: true,
		};
		expect(BookSchema.safeParse(full).success).toBe(true);
	});

	it("rejects a missing required field (title)", () => {
		const {title: _t, ...noTitle} = valid;
		expect(BookSchema.safeParse(noTitle).success).toBe(false);
	});

	it("rejects a non-integer id", () => {
		expect(BookSchema.safeParse({...valid, id: 1.5}).success).toBe(false);
	});

	it("rejects id <= 0", () => {
		expect(BookSchema.safeParse({...valid, id: 0}).success).toBe(false);
	});

	it("rejects a negative price", () => {
		expect(BookSchema.safeParse({...valid, price: -1}).success).toBe(false);
	});

	it("rejects a non-URL coverImageUrl", () => {
		expect(BookSchema.safeParse({...valid, coverImageUrl: "not-a-url"}).success).toBe(
			false,
		);
	});

	it("rejects an empty title", () => {
		expect(BookSchema.safeParse({...valid, title: ""}).success).toBe(false);
	});

	it("rejects a missing author", () => {
		const {author: _a, ...noAuthor} = valid;
		expect(BookSchema.safeParse(noAuthor).success).toBe(false);
	});
});

describe("BooksArraySchema", () => {
	it("parses an empty array", () => {
		expect(BooksArraySchema.safeParse([]).success).toBe(true);
	});

	it("rejects non-array input", () => {
		expect(BooksArraySchema.safeParse(null).success).toBe(false);
		expect(BooksArraySchema.safeParse({}).success).toBe(false);
	});

	it("rejects an array with one invalid item", () => {
		const bad = [
			{
				id: "not-a-number",
				title: "T",
				author: "A",
				genre: "G",
				price: 100,
			},
		];
		expect(BooksArraySchema.safeParse(bad).success).toBe(false);
	});
});

// ─── User schema ──────────────────────────────────────────────────────────────

describe("UserSchema", () => {
	it("accepts a user with only a username", () => {
		expect(UserSchema.safeParse({username: "user@example.com"}).success).toBe(true);
	});

	it("accepts a user with an optional nickname", () => {
		expect(
			UserSchema.safeParse({username: "u@x.com", nickname: "Alice"}).success,
		).toBe(true);
	});

	it("rejects a missing username", () => {
		expect(UserSchema.safeParse({nickname: "Alice"}).success).toBe(false);
	});

	it("rejects an empty username", () => {
		expect(UserSchema.safeParse({username: ""}).success).toBe(false);
	});
});

describe("StoredUserSchema (strict)", () => {
	it("rejects extra keys such as bcryptHash", () => {
		const withHash = {username: "u@x.com", bcryptHash: "secret"};
		expect(StoredUserSchema.safeParse(withHash).success).toBe(false);
	});

	it("accepts only the allowed keys", () => {
		expect(
			StoredUserSchema.safeParse({username: "u@x.com", nickname: "Alice"}).success,
		).toBe(true);
	});
});

// ─── Auth result schema ───────────────────────────────────────────────────────

describe("AuthResultSchema (discriminated union)", () => {
	it("parses a success response", () => {
		const ok = {success: true, user: {username: "u@x.com"}};
		const result = AuthResultSchema.safeParse(ok);
		expect(result.success).toBe(true);
		if (result.success) expect(result.data.success).toBe(true);
	});

	it("parses a failure response", () => {
		const fail = {success: false, message: "Невірний пароль!"};
		const result = AuthResultSchema.safeParse(fail);
		expect(result.success).toBe(true);
		if (result.success) expect(result.data.success).toBe(false);
	});

	it("rejects a success response missing the user field", () => {
		expect(AuthResultSchema.safeParse({success: true}).success).toBe(false);
	});

	it("rejects a failure response missing the message field", () => {
		expect(AuthResultSchema.safeParse({success: false}).success).toBe(false);
	});

	it("rejects completely unknown shapes", () => {
		expect(AuthResultSchema.safeParse({foo: "bar"}).success).toBe(false);
	});
});

describe("AuthSuccessSchema", () => {
	it("enforces success literal true", () => {
		expect(
			AuthSuccessSchema.safeParse({success: false, user: {username: "u"}}).success,
		).toBe(false);
	});
});

describe("AuthFailureSchema", () => {
	it("enforces success literal false", () => {
		expect(AuthFailureSchema.safeParse({success: true, message: "x"}).success).toBe(
			false,
		);
	});
});

describe("ForgotPasswordResultSchema", () => {
	it("accepts a valid dev-mode result", () => {
		const data = {
			success: true,
			email: "a@b.com",
			sent: false,
			devCode: "123456",
		};
		expect(ForgotPasswordResultSchema.safeParse(data).success).toBe(true);
	});

	it("accepts a result without devCode", () => {
		const data = {success: true, email: "a@b.com", sent: true};
		expect(ForgotPasswordResultSchema.safeParse(data).success).toBe(true);
	});

	it("rejects a non-email address", () => {
		const data = {success: true, email: "not-email", sent: false};
		expect(ForgotPasswordResultSchema.safeParse(data).success).toBe(false);
	});
});

// ─── Storage schemas ──────────────────────────────────────────────────────────

describe("SavedBooksStorageSchema", () => {
	const validBook = {
		id: 1,
		title: "T",
		author: "A",
		genre: "G",
		price: 100,
	};

	it("accepts a valid array of books", () => {
		expect(SavedBooksStorageSchema.safeParse([validBook]).success).toBe(true);
	});

	it("rejects null", () => {
		expect(SavedBooksStorageSchema.safeParse(null).success).toBe(false);
	});
});

describe("PendingBookStorageSchema", () => {
	it("accepts a valid book", () => {
		const b = {
			id: 3,
			title: "T",
			author: "A",
			genre: "G",
			price: 150,
		};
		expect(PendingBookStorageSchema.safeParse(b).success).toBe(true);
	});
});

describe("RateLimitRecordSchema", () => {
	it("accepts valid attempts/blockedUntil", () => {
		expect(
			RateLimitRecordSchema.safeParse({attempts: 2, blockedUntil: 0}).success,
		).toBe(true);
	});

	it("rejects negative attempts", () => {
		expect(
			RateLimitRecordSchema.safeParse({attempts: -1, blockedUntil: 0}).success,
		).toBe(false);
	});
});

describe("ResetRecordSchema", () => {
	it("accepts a valid reset record", () => {
		expect(
			ResetRecordSchema.safeParse({code: "123456", expiry: 9999999999}).success,
		).toBe(true);
	});

	it("rejects a code that is not exactly 6 characters", () => {
		expect(
			ResetRecordSchema.safeParse({code: "12345", expiry: 9999999999}).success,
		).toBe(false);
	});

	it("rejects a non-positive expiry", () => {
		expect(ResetRecordSchema.safeParse({code: "123456", expiry: 0}).success).toBe(
			false,
		);
	});
});

describe("SortOrderSchema", () => {
	it('accepts "asc" and "desc"', () => {
		expect(SortOrderSchema.safeParse("asc").success).toBe(true);
		expect(SortOrderSchema.safeParse("desc").success).toBe(true);
	});

	it("rejects unknown values", () => {
		expect(SortOrderSchema.safeParse("random").success).toBe(false);
		expect(SortOrderSchema.safeParse("").success).toBe(false);
	});
});

// ─── Cart schemas ─────────────────────────────────────────────────────────────

describe("CartItemSchema", () => {
	const valid = {
		bookId: 1,
		title: "T",
		author: "A",
		price: 100,
		quantity: 2,
		subtotal: 200,
	};

	it("accepts a minimal valid cart item", () => {
		expect(CartItemSchema.safeParse(valid).success).toBe(true);
	});

	it("rejects a zero or negative quantity", () => {
		expect(CartItemSchema.safeParse({...valid, quantity: 0}).success).toBe(false);
	});

	it("rejects a negative subtotal", () => {
		expect(CartItemSchema.safeParse({...valid, subtotal: -1}).success).toBe(false);
	});

	it("rejects a non-positive bookId", () => {
		expect(CartItemSchema.safeParse({...valid, bookId: 0}).success).toBe(false);
	});
});

describe("CartSchema", () => {
	it("accepts an empty cart", () => {
		expect(
			CartSchema.safeParse({items: [], totalPrice: 0, totalItems: 0}).success,
		).toBe(true);
	});

	it("rejects a negative totalPrice", () => {
		expect(
			CartSchema.safeParse({items: [], totalPrice: -1, totalItems: 0}).success,
		).toBe(false);
	});

	it("rejects a cart with an invalid item", () => {
		expect(
			CartSchema.safeParse({
				items: [
					{
						bookId: -1,
						title: "T",
						author: "A",
						price: 1,
						quantity: 1,
						subtotal: 1,
					},
				],
				totalPrice: 1,
				totalItems: 1,
			}).success,
		).toBe(false);
	});
});

// ─── Order schemas ────────────────────────────────────────────────────────────

describe("OrderItemSchema", () => {
	it("accepts a valid order item", () => {
		expect(
			OrderItemSchema.safeParse({
				bookId: 1,
				title: "T",
				author: "A",
				quantity: 1,
				unitPrice: 100,
			}).success,
		).toBe(true);
	});

	it("rejects a zero quantity", () => {
		expect(
			OrderItemSchema.safeParse({
				bookId: 1,
				title: "T",
				author: "A",
				quantity: 0,
				unitPrice: 100,
			}).success,
		).toBe(false);
	});
});

describe("OrderSummarySchema", () => {
	const valid = {
		id: 1,
		number: "ORD-0001",
		status: "pending",
		totalPrice: 100,
		itemsCount: 2,
		createdAt: "2026-02-13T00:00:00.000Z",
	};

	it("accepts a valid order summary", () => {
		expect(OrderSummarySchema.safeParse(valid).success).toBe(true);
	});

	it("rejects a non-positive id", () => {
		expect(OrderSummarySchema.safeParse({...valid, id: 0}).success).toBe(false);
	});
});

describe("OrderDetailSchema", () => {
	it("accepts a valid order detail with items instead of itemsCount", () => {
		const detail = {
			id: 1,
			number: "ORD-0001",
			status: "pending",
			totalPrice: 100,
			createdAt: "2026-02-13T00:00:00.000Z",
			items: [{bookId: 1, title: "T", author: "A", quantity: 1, unitPrice: 100}],
		};
		expect(OrderDetailSchema.safeParse(detail).success).toBe(true);
	});

	it("rejects an order detail with an invalid item", () => {
		const detail = {
			id: 1,
			number: "ORD-0001",
			status: "pending",
			totalPrice: 100,
			createdAt: "2026-02-13T00:00:00.000Z",
			items: [{bookId: 1, title: "T", author: "A", quantity: 0, unitPrice: 100}],
		};
		expect(OrderDetailSchema.safeParse(detail).success).toBe(false);
	});
});
