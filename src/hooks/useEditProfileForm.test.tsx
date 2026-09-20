import {describe, it, expect, vi} from "vitest";
import {renderHook, act} from "@testing-library/react";
import {useEditProfileForm} from "./useEditProfileForm";
import {LocaleWrapper, MOCK_USER} from "../tests/testHelpers";
import {TRANSLATIONS} from "../i18n/translations";
import type {ReactNode} from "react";

const wrapper = ({children}: {children: ReactNode}) => (
	<LocaleWrapper>{children}</LocaleWrapper>
);

const t = TRANSLATIONS.uk.validation;

describe("useEditProfileForm", () => {
	it("initialises nickname from the current user", () => {
		const {result} = renderHook(() => useEditProfileForm(MOCK_USER, vi.fn()), {
			wrapper,
		});
		expect(result.current.form.nickname).toBe(MOCK_USER.nickname);
	});

	it("initialises with an empty password field", () => {
		const {result} = renderHook(() => useEditProfileForm(MOCK_USER, vi.fn()), {
			wrapper,
		});
		expect(result.current.form.password).toBe("");
	});

	it("does not block submission when the password field is empty", () => {
		const {result} = renderHook(() => useEditProfileForm(MOCK_USER, vi.fn()), {
			wrapper,
		});
		expect(result.current.isSubmitDisabled).toBe(false);
	});

	it("blocks submission when the password field has an active error", () => {
		const {result} = renderHook(() => useEditProfileForm(MOCK_USER, vi.fn()), {
			wrapper,
		});
		act(() => {
			result.current.handleChange({
				target: {name: "password", value: "weak"},
			} as React.ChangeEvent<HTMLInputElement>);
		});
		expect(result.current.isSubmitDisabled).toBe(true);
		expect(result.current.errors["password"]).toBeTruthy();
	});

	it("clears the password error when a valid password is entered", () => {
		const {result} = renderHook(() => useEditProfileForm(MOCK_USER, vi.fn()), {
			wrapper,
		});
		act(() => {
			result.current.handleChange({
				target: {name: "password", value: "weak"},
			} as React.ChangeEvent<HTMLInputElement>);
		});
		act(() => {
			result.current.handleChange({
				target: {name: "password", value: "SecureP4ss"},
			} as React.ChangeEvent<HTMLInputElement>);
		});
		expect(result.current.errors["password"]).toBe("");
	});

	it("calls onSave with only the changed fields", async () => {
		const onSave = vi.fn().mockResolvedValue(undefined);
		const {result} = renderHook(() => useEditProfileForm(MOCK_USER, onSave), {
			wrapper,
		});
		act(() => {
			result.current.handleChange({
				target: {name: "nickname", value: "NewName"},
			} as React.ChangeEvent<HTMLInputElement>);
		});
		await act(async () => {
			await result.current.handleSubmit({
				preventDefault: vi.fn(),
			} as unknown as React.FormEvent<HTMLFormElement>);
		});
		expect(onSave).toHaveBeenCalledWith({nickname: "NewName"});
	});

	it("does not call onSave when nothing has changed", async () => {
		const onSave = vi.fn();
		const {result} = renderHook(() => useEditProfileForm(MOCK_USER, onSave), {
			wrapper,
		});
		await act(async () => {
			await result.current.handleSubmit({
				preventDefault: vi.fn(),
			} as unknown as React.FormEvent<HTMLFormElement>);
		});
		expect(onSave).not.toHaveBeenCalled();
	});

	it("initialises correctly when user is null", () => {
		const {result} = renderHook(() => useEditProfileForm(null, vi.fn()), {
			wrapper,
		});
		expect(result.current.form.nickname).toBe("");
	});
});
