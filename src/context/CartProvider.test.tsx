import {describe, it, expect, vi, beforeEach} from "vitest";
import type {ReactNode} from "react";
import {render, screen, waitFor} from "@testing-library/react";
import {CartProvider} from "./CartProvider";
import {useCart} from "../hooks/useCart";
import type {CartContextValue} from "./CartContext";
import type {Cart} from "../schemas";

vi.mock("../services/cartService", () => {
	const mockCart: Cart = {
		items: [
			{
				bookId: 1,
				title: "The Hobbit",
				author: "J.R.R. Tolkien",
				price: 199,
				quantity: 2,
				subtotal: 398,
			},
		],
		totalPrice: 398,
		totalItems: 2,
	};
	return {
		cartService: {
			getCart: vi.fn().mockResolvedValue(mockCart),
			addItem: vi.fn().mockResolvedValue(mockCart),
			updateQuantity: vi.fn().mockResolvedValue(mockCart),
			removeItem: vi.fn().mockResolvedValue(mockCart),
		},
	};
});

const CartConsumer = (): React.ReactElement => {
	const {cart} = useCart();
	return (
		<ul>
			{cart?.items.map((item) => (
				<li key={item.bookId}>{item.title}</li>
			))}
		</ul>
	);
};

const renderProvider = (ui: ReactNode) => render(<CartProvider>{ui}</CartProvider>);

describe("CartProvider", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("provides cart data to consumers after initial load", async () => {
		renderProvider(<CartConsumer />);
		await waitFor(() => {
			expect(screen.getByText("The Hobbit")).toBeInTheDocument();
		});
	});

	it("exposes the required context shape", async () => {
		let capturedContext: CartContextValue | undefined;

		const ContextInspector = (): null => {
			capturedContext = useCart();
			return null;
		};

		renderProvider(<ContextInspector />);

		await waitFor(() => {
			expect(capturedContext).toMatchObject({
				cart: expect.anything(),
				loading: expect.any(Boolean),
				error: null,
				refresh: expect.any(Function),
				addItem: expect.any(Function),
				updateQuantity: expect.any(Function),
				removeItem: expect.any(Function),
			});
		});
	});

	it("renders children without crashing", () => {
		renderProvider(<p>Child content</p>);
		expect(screen.getByText("Child content")).toBeInTheDocument();
	});

	it("starts in a loading state before the initial fetch resolves", async () => {
		let capturedContext: CartContextValue | undefined;
		const ContextInspector = (): null => {
			capturedContext = useCart();
			return null;
		};
		renderProvider(<ContextInspector />);
		expect(capturedContext?.loading).toBe(true);
		// Let the pending fetch resolve so React doesn't warn about an
		// update happening after the test has already finished asserting.
		await waitFor(() => expect(capturedContext?.loading).toBe(false));
	});

	it("sets an error message when the initial fetch rejects", async () => {
		const {cartService} = await import("../services/cartService");
		vi.mocked(cartService.getCart).mockRejectedValueOnce(new Error("Network down"));

		let capturedContext: CartContextValue | undefined;
		const ContextInspector = (): null => {
			capturedContext = useCart();
			return null;
		};
		renderProvider(<ContextInspector />);

		await waitFor(() => {
			expect(capturedContext?.error).toBe("Network down");
		});
	});
});
