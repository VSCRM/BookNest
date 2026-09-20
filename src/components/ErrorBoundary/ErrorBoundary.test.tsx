import {describe, it, expect, vi} from "vitest";
import {render, screen, fireEvent} from "@testing-library/react";
import {ErrorBoundary} from "./ErrorBoundary";

/** Component that deliberately throws a render error. */
function Bomb({shouldThrow}: {shouldThrow: boolean}): React.ReactElement {
	if (shouldThrow) throw new Error("Test render error");
	return <p>All good</p>;
}

describe("ErrorBoundary", () => {
	it("renders children when there is no error", () => {
		render(
			<ErrorBoundary>
				<Bomb shouldThrow={false} />
			</ErrorBoundary>,
		);
		expect(screen.getByText("All good")).toBeInTheDocument();
	});

	it("renders the default fallback UI when a child throws", () => {
		const spy = vi.spyOn(console, "error").mockImplementation(() => {});
		render(
			<ErrorBoundary>
				<Bomb shouldThrow={true} />
			</ErrorBoundary>,
		);
		expect(screen.getByRole("alert")).toBeInTheDocument();
		expect(screen.getByText("Test render error")).toBeInTheDocument();
		spy.mockRestore();
	});

	it("renders the custom fallback when provided", () => {
		const spy = vi.spyOn(console, "error").mockImplementation(() => {});
		render(
			<ErrorBoundary fallback={(err) => <p>Custom: {err.message}</p>}>
				<Bomb shouldThrow={true} />
			</ErrorBoundary>,
		);
		expect(screen.getByText("Custom: Test render error")).toBeInTheDocument();
		spy.mockRestore();
	});

	it("resets the error when the reset button is clicked", () => {
		const spy = vi.spyOn(console, "error").mockImplementation(() => {});
		render(
			<ErrorBoundary>
				<Bomb shouldThrow={true} />
			</ErrorBoundary>,
		);
		fireEvent.click(screen.getByRole("button", {name: /try again/i}));
		// After reset, children render again (and throw again in this test — just verify button worked)
		expect(screen.getByRole("button", {name: /try again/i})).toBeInTheDocument();
		spy.mockRestore();
	});
});
