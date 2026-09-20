import {describe, it, expect, vi} from "vitest";
import {renderHook, act} from "@testing-library/react";
import {useRegisterForm} from "./useRegisterForm";
import {TestWrapper, makeAuthContext} from "../tests/testHelpers";
import {TRANSLATIONS} from "../i18n/translations";
import type {ReactNode} from "react";

const t = TRANSLATIONS.uk.validation;

// Wrapper that mocks register to fail
const failWrapper = ({children}: {children: ReactNode}) => (
	<TestWrapper
		authValue={makeAuthContext({
			register: vi
				.fn()
				.mockResolvedValue({success: false, message: "Вже зайнятий"}),
		})}
	>
		{children}
	</TestWrapper>
);

const wrapper = ({children}: {children: ReactNode}) => (
	<TestWrapper>{children}</TestWrapper>
);

describe("useRegisterForm", () => {
	it("initialises with empty fields and no errors", () => {
		const {result} = renderHook(() => useRegisterForm(), {wrapper});
		expect(result.current.form.email).toBe("");
		expect(result.current.isValid).toBe(false);
	});

	it("validates email on change — sets error for invalid email", () => {
		const {result} = renderHook(() => useRegisterForm(), {wrapper});
		act(() => {
			result.current.handleChange({
				target: {name: "email", value: "bad"},
			} as React.ChangeEvent<HTMLInputElement>);
		});
		expect(result.current.errors["email"]).toBe(t.invalidEmail);
	});

	it("clears email error for a valid email", () => {
		const {result} = renderHook(() => useRegisterForm(), {wrapper});
		act(() => {
			result.current.handleChange({
				target: {name: "email", value: "good@example.com"},
			} as React.ChangeEvent<HTMLInputElement>);
		});
		expect(result.current.errors["email"]).toBe("");
	});

	it("validates password on change — error for weak password", () => {
		const {result} = renderHook(() => useRegisterForm(), {wrapper});
		act(() => {
			result.current.handleChange({
				target: {name: "email", value: "g@g.com"},
			} as React.ChangeEvent<HTMLInputElement>);
			result.current.handleChange({
				target: {name: "password", value: "weak"},
			} as React.ChangeEvent<HTMLInputElement>);
		});
		expect(result.current.errors["password"]).toBeTruthy();
	});

	it("isValid is true when valid email and strong password", () => {
		const {result} = renderHook(() => useRegisterForm(), {wrapper});
		act(() => {
			result.current.handleChange({
				target: {name: "email", value: "user@example.com"},
			} as React.ChangeEvent<HTMLInputElement>);
			result.current.handleChange({
				target: {name: "password", value: "SecureP4ss"},
			} as React.ChangeEvent<HTMLInputElement>);
		});
		expect(result.current.isValid).toBe(true);
	});

	it("sets authError on register failure", async () => {
		const {result} = renderHook(() => useRegisterForm(), {
			wrapper: failWrapper,
		});
		act(() => {
			result.current.handleChange({
				target: {name: "email", value: "user@example.com"},
			} as React.ChangeEvent<HTMLInputElement>);
			result.current.handleChange({
				target: {name: "password", value: "SecureP4ss"},
			} as React.ChangeEvent<HTMLInputElement>);
		});
		await act(async () => {
			await result.current.handleSubmit({
				preventDefault: vi.fn(),
			} as unknown as React.FormEvent<HTMLFormElement>);
		});
		expect(result.current.authError).toBe("Вже зайнятий");
	});
});
