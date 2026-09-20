import {describe, it, expect, vi} from "vitest";
import {render, screen, fireEvent} from "@testing-library/react";
import {SortControl} from "./SortControl";
import {LocaleWrapper} from "../../tests/testHelpers";
import {TRANSLATIONS} from "../../i18n/translations";

const t = TRANSLATIONS.uk.sort;

const renderControl = (order: "asc" | "desc", onToggle = vi.fn()) =>
	render(
		<LocaleWrapper>
			<SortControl order={order} onToggle={onToggle} />
		</LocaleWrapper>,
	);

describe("SortControl", () => {
	it('renders the "newest first" label when order is "desc"', () => {
		renderControl("desc");
		expect(screen.getByRole("button")).toHaveTextContent(t.newestFirst);
	});

	it('renders the "oldest first" label when order is "asc"', () => {
		renderControl("asc");
		expect(screen.getByRole("button")).toHaveTextContent(t.oldestFirst);
	});

	it("calls onToggle when the button is clicked", () => {
		const onToggle = vi.fn();
		renderControl("desc", onToggle);
		fireEvent.click(screen.getByRole("button"));
		expect(onToggle).toHaveBeenCalledTimes(1);
	});

	it('has aria-pressed=false in "desc" mode', () => {
		renderControl("desc");
		expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "false");
	});

	it('has aria-pressed=true in "asc" mode', () => {
		renderControl("asc");
		expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "true");
	});

	it("has a descriptive aria-label", () => {
		renderControl("desc");
		expect(screen.getByRole("button")).toHaveAttribute("aria-label", t.ariaNewest);
	});
});
