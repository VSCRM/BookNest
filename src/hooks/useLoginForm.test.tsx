import {describe, it, expect, vi, beforeEach} from "vitest";
import {renderHook, act} from "@testing-library/react";
import {type ReactNode} from "react";
import React from "react";
import {MemoryRouter} from "react-router";
import {LocaleProvider} from "../i18n/LocaleContext";

// ─── Mock useAuth so the hook does not need a real AuthProvider ───────────────
vi.mock("./useAuth", () => ({
	useAuth: () => ({
		login: mockLogin,
		loading: false,
		savedBooks: [],
		user: null,
		logout: vi.fn(),
		register: vi.fn(),
		updateUser: vi.fn(),
		saveBook: vi.fn(),
		unsaveBook: vi.fn(),
	}),
}));

const mockLogin = vi.fn();

// useLoginForm now calls useLocale() for error translation — needs LocaleProvider.
function wrapper({children}: {children: ReactNode}) {
	return (
		<LocaleProvider>
			<MemoryRouter>{children}</MemoryRouter>
		</LocaleProvider>
	);
}

import {useLoginForm} from "./useLoginForm";

describe("useLoginForm", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("initialises with empty fields and no errors", () => {
		const {result} = renderHook(() => useLoginForm(), {wrapper});
		expect(result.current.email).toBe("");
		expect(result.current.password).toBe("");
		expect(result.current.authError).toBe("");
		expect(result.current.emailError).toBe("");
	});

	it("setEmail updates email state", () => {
		const {result} = renderHook(() => useLoginForm(), {wrapper});
		act(() => result.current.setEmail("user@example.com"));
		expect(result.current.email).toBe("user@example.com");
	});

	it("setPassword updates password state", () => {
		const {result} = renderHook(() => useLoginForm(), {wrapper});
		act(() => result.current.setPassword("MyP4ss"));
		expect(result.current.password).toBe("MyP4ss");
	});

	it("calls login with current email and password on submit", async () => {
		mockLogin.mockResolvedValue({success: true, user: {username: "u@x.com"}});
		const {result} = renderHook(() => useLoginForm(), {wrapper});
		act(() => {
			result.current.setEmail("user@example.com");
			result.current.setPassword("SecureP4ss");
		});
		const fakeEvent = {
			preventDefault: vi.fn(),
		} as unknown as React.FormEvent<HTMLFormElement>;
		await act(async () => {
			await result.current.handleSubmit(fakeEvent);
		});
		expect(mockLogin).toHaveBeenCalledWith("user@example.com", "SecureP4ss");
	});

	it("sets authError when login fails — translates error code to active locale message", async () => {
		// authService now returns error codes; resolveAuthError translates to the active locale (uk).
		mockLogin.mockResolvedValue({success: false, message: "wrong_password"});
		const {result} = renderHook(() => useLoginForm(), {wrapper});
		const fakeEvent = {
			preventDefault: vi.fn(),
		} as unknown as React.FormEvent<HTMLFormElement>;
		await act(async () => {
			await result.current.handleSubmit(fakeEvent);
		});
		// Default locale is 'uk' → t.auth.wrong_password = 'Невірний пароль!'
		expect(result.current.authError).toBe("Невірний пароль!");
	});
});
