import {describe, it, expect, vi} from "vitest";
import {render, screen, fireEvent} from "@testing-library/react";
import {Toast} from "./Toast";
import {LocaleWrapper} from "../../tests/testHelpers";

// Toast uses useLocale() for the close-button aria-label, so it needs LocaleWrapper.
const renderToast = (props: Parameters<typeof Toast>[0]) =>
	render(<Toast {...props} />, {wrapper: LocaleWrapper});

describe("Toast", () => {
	it("renders the message text", () => {
		renderToast({message: "Test message"});
		expect(screen.getByText("Test message")).toBeInTheDocument();
	});

	it('has role="status" for screen-reader accessibility', () => {
		renderToast({message: "Accessible"});
		expect(screen.getByRole("status")).toBeInTheDocument();
	});

	it("renders a CheckCircle icon", () => {
		renderToast({message: "OK"});
		expect(screen.getByRole("status")).toBeInTheDocument();
	});

	it("renders a close button when onClose is provided", () => {
		renderToast({message: "Hi", onClose: vi.fn()});
		// aria-label comes from t.form.closeNotice — default locale is 'uk'
		expect(
			screen.getByRole("button", {name: "Закрити повідомлення"}),
		).toBeInTheDocument();
	});

	it("calls onClose when the close button is clicked", () => {
		const onClose = vi.fn();
		renderToast({message: "Hi", onClose});
		fireEvent.click(screen.getByRole("button", {name: "Закрити повідомлення"}));
		expect(onClose).toHaveBeenCalledTimes(1);
	});

	it("does not render a close button when onClose is not provided", () => {
		renderToast({message: "No close"});
		expect(screen.queryByRole("button")).toBeNull();
	});
});
