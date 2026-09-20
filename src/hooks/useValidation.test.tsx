/**
 * Tests for useValidation hook.
 *
 * Coverage:
 * a) validate() returns '' for a valid field value.
 * b) validate() returns the translated error string for an invalid value.
 * c) validateAll() returns true only when all fields pass.
 * d) clearErrors() resets all errors to empty strings.
 * e) Translation key resolution works in both locales.
 */

import {describe, it, expect} from "vitest";
import {renderHook, act} from "@testing-library/react";
import type {ReactNode} from "react";
import {useValidation} from "./useValidation";
import {LocaleProvider} from "../i18n/LocaleContext";
import {TRANSLATIONS} from "../i18n/translations";

const wrapper = ({children}: {children: ReactNode}) => (
	<LocaleProvider>{children}</LocaleProvider>
);

describe("useValidation", () => {
	describe("validate()", () => {
		it("returns empty string for a valid email", () => {
			const {result} = renderHook(() => useValidation(["email"]), {wrapper});
			let msg = "";
			act(() => {
				msg = result.current.validate("email", "user@example.com");
			});
			expect(msg).toBe("");
			expect(result.current.errors.email).toBe("");
		});

		it('returns translated "required" message for an empty email', () => {
			const {result} = renderHook(() => useValidation(["email"]), {wrapper});
			let msg = "";
			act(() => {
				msg = result.current.validate("email", "");
			});
			const expected = TRANSLATIONS.uk.validation.required;
			expect(msg).toBe(expected);
			expect(result.current.errors.email).toBe(expected);
		});

		it('returns translated "invalidEmail" message for a malformed email', () => {
			const {result} = renderHook(() => useValidation(["email"]), {wrapper});
			let msg = "";
			act(() => {
				msg = result.current.validate("email", "not-an-email");
			});
			expect(msg).toBe(TRANSLATIONS.uk.validation.invalidEmail);
		});

		it('returns translated "minPassword" message for a short password', () => {
			const {result} = renderHook(() => useValidation(["password"]), {wrapper});
			let msg = "";
			act(() => {
				msg = result.current.validate("password", "Ab1");
			});
			expect(msg).toBe(TRANSLATIONS.uk.validation.minPassword);
		});

		it("silently ignores unknown field names", () => {
			const {result} = renderHook(() => useValidation(["email"]), {wrapper});
			let msg = "";
			act(() => {
				msg = result.current.validate("unknown", "anything");
			});
			expect(msg).toBe("");
		});
	});

	describe("validateAll()", () => {
		it("returns true when all fields are valid", () => {
			const {result} = renderHook(() => useValidation(["email", "password"]), {
				wrapper,
			});
			let valid = false;
			act(() => {
				valid = result.current.validateAll({
					email: "user@example.com",
					password: "ValidPass1",
				});
			});
			expect(valid).toBe(true);
		});

		it("returns false when any field is invalid", () => {
			const {result} = renderHook(() => useValidation(["email", "password"]), {
				wrapper,
			});
			let valid = true;
			act(() => {
				valid = result.current.validateAll({
					email: "bad-email",
					password: "ValidPass1",
				});
			});
			expect(valid).toBe(false);
			expect(result.current.errors.email).toBe(
				TRANSLATIONS.uk.validation.invalidEmail,
			);
		});
	});

	describe("clearErrors()", () => {
		it("resets all errors to empty strings", () => {
			const {result} = renderHook(() => useValidation(["email", "password"]), {
				wrapper,
			});
			act(() => {
				result.current.validate("email", "");
				result.current.validate("password", "");
			});
			act(() => result.current.clearErrors());
			expect(result.current.errors.email).toBe("");
			expect(result.current.errors.password).toBe("");
		});
	});

	describe("setFieldError()", () => {
		it("sets an arbitrary error on a named field", () => {
			const {result} = renderHook(() => useValidation(["email"]), {wrapper});
			act(() => result.current.setFieldError("email", "Custom error"));
			expect(result.current.errors.email).toBe("Custom error");
		});
	});
});
