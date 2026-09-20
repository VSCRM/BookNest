import {describe, it, expect, vi} from "vitest";
import {render, screen, fireEvent} from "@testing-library/react";
import {GenreFilter} from "./GenreFilter";
import {LocaleWrapper} from "../../tests/testHelpers";
import {TRANSLATIONS} from "../../i18n/translations";

const GENRES = ["All", "Fantasy", "Novel", "IT"] as const;

const renderFilter = (active = "All", onChange = vi.fn()) =>
	render(
		<LocaleWrapper>
			<GenreFilter genres={GENRES} active={active} onChange={onChange} />
		</LocaleWrapper>,
	);

describe("GenreFilter", () => {
	it("renders a button for every genre", () => {
		renderFilter();
		GENRES.forEach((genre) =>
			expect(screen.getByRole("button", {name: genre})).toBeInTheDocument(),
		);
	});

	it("marks only the active genre with aria-pressed=true", () => {
		renderFilter("Fantasy");
		expect(screen.getByRole("button", {name: "Fantasy"})).toHaveAttribute(
			"aria-pressed",
			"true",
		);
		expect(screen.getByRole("button", {name: "All"})).toHaveAttribute(
			"aria-pressed",
			"false",
		);
	});

	it("calls onChange with the correct genre when clicked", () => {
		const onChange = vi.fn();
		renderFilter("All", onChange);
		fireEvent.click(screen.getByRole("button", {name: "Novel"}));
		expect(onChange).toHaveBeenCalledWith("Novel");
	});

	it("has an accessible nav landmark with i18n aria-label", () => {
		renderFilter();
		expect(
			screen.getByRole("navigation", {name: TRANSLATIONS.uk.home.genreNav}),
		).toBeInTheDocument();
	});

	it("active button has aria-pressed=true and other buttons have aria-pressed=false", () => {
		renderFilter("IT");
		expect(screen.getByRole("button", {name: "IT"})).toHaveAttribute(
			"aria-pressed",
			"true",
		);
		["All", "Fantasy", "Novel"].forEach((genre) =>
			expect(screen.getByRole("button", {name: genre})).toHaveAttribute(
				"aria-pressed",
				"false",
			),
		);
	});
});
