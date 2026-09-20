import {describe, it, expect, vi} from "vitest";
import {render, screen, fireEvent} from "@testing-library/react";
import {FormInput} from "./FormInput";

describe("FormInput", () => {
	it("renders the label text", () => {
		render(<FormInput label="Email" name="email" />);
		expect(screen.getByLabelText("Email")).toBeInTheDocument();
	});

	it("renders the input with the correct name attribute", () => {
		render(<FormInput label="Email" name="email" />);
		expect(screen.getByLabelText("Email")).toHaveAttribute("name", "email");
	});

	it("renders an inline error message when the error prop is provided", () => {
		render(<FormInput label="Email" name="email" error="Невірний формат" />);
		expect(screen.getByRole("alert")).toHaveTextContent("Невірний формат");
	});

	it("does not render an error element when the error prop is empty", () => {
		render(<FormInput label="Email" name="email" error="" />);
		expect(screen.queryByRole("alert")).not.toBeInTheDocument();
	});

	it("sets aria-invalid=true when there is an error", () => {
		render(<FormInput label="Email" name="email" error="Error" />);
		expect(screen.getByLabelText("Email")).toHaveAttribute("aria-invalid", "true");
	});

	it("sets aria-invalid=false when there is no error", () => {
		render(<FormInput label="Email" name="email" />);
		expect(screen.getByLabelText("Email")).toHaveAttribute("aria-invalid", "false");
	});

	it("passes the value prop to the input", () => {
		render(
			<FormInput
				label="Email"
				name="email"
				value="test@x.com"
				onChange={vi.fn()}
			/>,
		);
		expect(screen.getByLabelText("Email")).toHaveValue("test@x.com");
	});

	it("calls onChange when the user types", () => {
		const onChange = vi.fn();
		render(<FormInput label="Email" name="email" value="" onChange={onChange} />);
		fireEvent.change(screen.getByLabelText("Email"), {
			target: {value: "a@b.com"},
		});
		expect(onChange).toHaveBeenCalled();
	});
});
