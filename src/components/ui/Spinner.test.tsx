import {describe, it, expect} from "vitest";
import {render, screen} from "@testing-library/react";
import {Spinner} from "./Spinner";

describe("Spinner", () => {
	it("renders with the default label", () => {
		render(<Spinner />);
		expect(screen.getByRole("status", {name: "Loading…"})).toBeInTheDocument();
	});

	it("renders with a custom label", () => {
		render(<Spinner label="Fetching articles…" />);
		expect(
			screen.getByRole("status", {name: "Fetching articles…"}),
		).toBeInTheDocument();
	});

	it("applies the requested size as inline style", () => {
		render(<Spinner size={48} label="test" />);
		const el = screen.getByRole("status");
		expect(el.style.width).toBe("48px");
		expect(el.style.height).toBe("48px");
	});
});
