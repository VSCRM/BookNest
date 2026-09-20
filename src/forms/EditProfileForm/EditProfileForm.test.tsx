import {describe, it, expect, vi} from "vitest";
import {render, screen, fireEvent} from "@testing-library/react";
import {EditProfileForm} from "./EditProfileForm";
import {LocaleWrapper, MOCK_USER} from "../../tests/testHelpers";

const renderForm = (
	onCancel = vi.fn(),
	onSave = vi.fn<() => Promise<void>>().mockResolvedValue(undefined),
) =>
	render(
		<LocaleWrapper>
			<EditProfileForm
				user={MOCK_USER}
				onSave={onSave}
				onCancel={onCancel}
				loading={false}
			/>
		</LocaleWrapper>,
	);

describe("EditProfileForm", () => {
	it("renders the form heading", () => {
		renderForm();
		expect(screen.getByText("Редагування профілю")).toBeInTheDocument();
	});

	it("renders nickname input pre-filled with current nickname", () => {
		renderForm();
		expect(screen.getByPlaceholderText(/нікнейм/i)).toHaveValue(MOCK_USER.nickname);
	});

	it("renders the password input empty", () => {
		renderForm();
		expect(document.querySelector('input[name="password"]')).toHaveValue("");
	});

	it("shows a password error when a weak password is entered", () => {
		renderForm();
		fireEvent.change(document.querySelector('input[name="password"]')!, {
			target: {name: "password", value: "weak"},
		});
		expect(screen.getByRole("alert")).toBeInTheDocument();
	});

	it("disables the submit button when there is a password error", () => {
		renderForm();
		fireEvent.change(document.querySelector('input[name="password"]')!, {
			target: {name: "password", value: "weak"},
		});
		expect(screen.getByRole("button", {name: /зберегти/i})).toBeDisabled();
	});

	it("calls onCancel when the cancel button is clicked", () => {
		const onCancel = vi.fn();
		renderForm(onCancel);
		fireEvent.click(screen.getByRole("button", {name: /скасувати/i}));
		expect(onCancel).toHaveBeenCalledTimes(1);
	});
});
