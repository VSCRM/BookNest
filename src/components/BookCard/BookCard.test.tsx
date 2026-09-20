/**
 * Tests for BookCard.
 * Wraps in TestWrapper for LocaleProvider + MemoryRouter + AuthContext + CartContext.
 */
import {describe, it, expect, vi} from "vitest";
import {render, screen, fireEvent, act} from "@testing-library/react";
import {BookCard} from "./BookCard";
import {TestWrapper, MOCK_BOOK} from "../../tests/testHelpers";

const renderCard = (overrides = {}, cartValue = {}) =>
	render(
		<TestWrapper cartValue={cartValue}>
			<BookCard book={{...MOCK_BOOK, ...overrides}} />
		</TestWrapper>,
	);

describe("BookCard", () => {
	it("renders the book title", () => {
		renderCard();
		expect(screen.getByText(MOCK_BOOK.title)).toBeInTheDocument();
	});

	it("renders the book genre", () => {
		renderCard();
		expect(screen.getByText(MOCK_BOOK.genre)).toBeInTheDocument();
	});

	it("renders the book author", () => {
		renderCard();
		expect(screen.getByText(MOCK_BOOK.author)).toBeInTheDocument();
	});

	it("renders the book description", () => {
		renderCard();
		expect(screen.getByText(MOCK_BOOK.description!)).toBeInTheDocument();
	});

	it("renders a thumbnail image with the book title as alt text", () => {
		renderCard();
		expect(screen.getByRole("img", {name: MOCK_BOOK.title})).toBeInTheDocument();
	});

	it("renders a save button and an add-to-cart button", () => {
		renderCard();
		expect(screen.getAllByRole("button")).toHaveLength(2);
	});

	it('has data-testid="book-card"', () => {
		renderCard();
		expect(screen.getByTestId("book-card")).toBeInTheDocument();
	});

	it("renders a link to the book detail page", () => {
		renderCard();
		const link = screen.getByRole("link");
		expect(link).toHaveAttribute("href", `/book/${MOCK_BOOK.id}`);
	});

	it("calls addItem when the add-to-cart button is clicked", async () => {
		const addItem = vi.fn().mockResolvedValue(undefined);
		renderCard({}, {addItem});
		await act(async () => {
			fireEvent.click(screen.getByRole("button", {name: /кошика/i}));
		});
		expect(addItem).toHaveBeenCalledWith(MOCK_BOOK.id);
	});

	it("disables the add-to-cart button when the book is out of stock", () => {
		renderCard({stock: 0});
		expect(screen.getByRole("button", {name: /кошика/i})).toBeDisabled();
	});

	it("uses card CSS module class (not global class)", () => {
		renderCard();
		const card = screen.getByTestId("book-card");
		// CSS modules hash the class — just verify it does NOT use a plain global class
		expect(card).not.toHaveClass("book-card");
	});
});
