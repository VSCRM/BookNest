import {describe, it, expect, vi, beforeEach} from "vitest";
import {render, screen, fireEvent, act} from "@testing-library/react";
import {TestWrapper} from "../../tests/testHelpers";
import {RegisterForm} from "./RegisterForm";
import {TRANSLATIONS} from "../../i18n/translations";

const t = TRANSLATIONS.uk.register;

describe("RegisterForm", () => {
	beforeEach(() => vi.clearAllMocks());

	it("renders the registration heading", () => {
		render(
			<TestWrapper>
				<RegisterForm />
			</TestWrapper>,
		);
		expect(screen.getByRole("heading", {name: t.heading})).toBeInTheDocument();
	});

	it("renders email, nickname, and password fields", () => {
		render(
			<TestWrapper>
				<RegisterForm />
			</TestWrapper>,
		);
		expect(screen.getByPlaceholderText("EMAIL")).toBeInTheDocument();
		expect(document.querySelector('input[name="nickname"]')).toBeInTheDocument();
		expect(document.querySelector('input[name="password"]')).toBeInTheDocument();
	});

	it("renders a disabled submit button initially (no valid data)", () => {
		render(
			<TestWrapper>
				<RegisterForm />
			</TestWrapper>,
		);
		expect(document.querySelector('button[type="submit"]')).toBeDisabled();
	});

	it("enables submit when valid email and strong password are provided", async () => {
		render(
			<TestWrapper>
				<RegisterForm />
			</TestWrapper>,
		);
		await act(async () => {
			fireEvent.change(screen.getByPlaceholderText("EMAIL"), {
				target: {name: "email", value: "valid@example.com"},
			});
			fireEvent.change(document.querySelector('input[name="password"]')!, {
				target: {name: "password", value: "SecureP4ss"},
			});
		});
		expect(document.querySelector('button[type="submit"]')).not.toBeDisabled();
	});

	it("shows a password strength hint when password is typed", async () => {
		render(
			<TestWrapper>
				<RegisterForm />
			</TestWrapper>,
		);
		await act(async () => {
			fireEvent.change(document.querySelector('input[name="password"]')!, {
				target: {name: "password", value: "Hello1"},
			});
		});
		expect(screen.getByTestId("password-strength")).toBeInTheDocument();
	});

	it("renders a link to the login page", () => {
		render(
			<TestWrapper>
				<RegisterForm />
			</TestWrapper>,
		);
		// Link text from translations.uk.register.hasAccount
		expect(screen.getByRole("link", {name: t.hasAccountLink})).toBeInTheDocument();
	});
});
