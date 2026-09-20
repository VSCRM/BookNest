import {describe, it, expect, vi} from "vitest";
import {render, screen, fireEvent} from "@testing-library/react";
import {PasswordInput} from "./PasswordInput";
import {LocaleWrapper} from "../../tests/testHelpers";
import {TRANSLATIONS} from "../../i18n/translations";

const t = TRANSLATIONS.uk.form;

const renderInput = (props: Record<string, unknown> = {}) =>
	render(
		<LocaleWrapper>
			<PasswordInput name="password" {...props} />
		</LocaleWrapper>,
	);

const getInput = () => document.querySelector("input") as HTMLInputElement;

describe("PasswordInput", () => {
	it('renders with type="password" by default', () => {
		renderInput();
		expect(getInput().type).toBe("password");
	});

	it('toggles to type="text" when show button is clicked', () => {
		renderInput();
		fireEvent.click(screen.getByRole("button", {name: t.showPassword}));
		expect(getInput().type).toBe("text");
	});

	it('toggles back to type="password" on second click', () => {
		renderInput();
		fireEvent.click(screen.getByRole("button", {name: t.showPassword}));
		fireEvent.click(screen.getByRole("button", {name: t.hidePassword}));
		expect(getInput().type).toBe("password");
	});

	it("displays an error message when error prop is set", () => {
		renderInput({error: "Too short"});
		expect(screen.getByRole("alert")).toHaveTextContent("Too short");
	});

	it("calls onChange when the user types", () => {
		const onChange = vi.fn();
		renderInput({value: "", onChange});
		fireEvent.change(getInput(), {target: {value: "Secret1"}});
		expect(onChange).toHaveBeenCalled();
	});

	it("sets aria-invalid when there is an error", () => {
		renderInput({error: "Error"});
		expect(getInput()).toHaveAttribute("aria-invalid", "true");
	});
});
