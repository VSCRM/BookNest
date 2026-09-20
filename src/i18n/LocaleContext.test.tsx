/**
 * Tests for LocaleContext (LocaleProvider + useLocale).
 *
 * Coverage:
 * a) Default locale is applied correctly.
 * b) setLocale switches the active translation dictionary.
 * c) useLocale throws outside a provider.
 * d) Translation objects have the expected keys (smoke test).
 */

import {describe, it, expect, vi, beforeEach} from "vitest";
import {renderHook, act} from "@testing-library/react";
import type {ReactNode} from "react";
import {LocaleProvider, useLocale} from "./LocaleContext";
import {TRANSLATIONS, DEFAULT_LOCALE} from "./translations";

// ─── localStorage mock ────────────────────────────────────────────────────────
const storageMock = (() => {
	let store: Record<string, string> = {};
	return {
		getItem: (k: string) => store[k] ?? null,
		setItem: (k: string, v: string) => {
			store[k] = v;
		},
		removeItem: (k: string) => {
			delete store[k];
		},
		clear: () => {
			store = {};
		},
	};
})();

Object.defineProperty(window, "localStorage", {
	value: storageMock,
	writable: true,
});

const wrapper = ({children}: {children: ReactNode}) => (
	<LocaleProvider>{children}</LocaleProvider>
);

beforeEach(() => storageMock.clear());

describe("LocaleProvider / useLocale", () => {
	it("provides the default locale on first render", () => {
		const {result} = renderHook(() => useLocale(), {wrapper});
		expect(result.current.locale).toBe(DEFAULT_LOCALE);
	});

	it("provides the correct translation dictionary for the default locale", () => {
		const {result} = renderHook(() => useLocale(), {wrapper});
		expect(result.current.t).toBe(TRANSLATIONS[DEFAULT_LOCALE]);
	});

	it("switches locale and updates the translation dictionary", () => {
		const {result} = renderHook(() => useLocale(), {wrapper});
		act(() => result.current.setLocale("en"));
		expect(result.current.locale).toBe("en");
		expect(result.current.t).toBe(TRANSLATIONS["en"]);
	});

	it("persists the chosen locale to localStorage", () => {
		const {result} = renderHook(() => useLocale(), {wrapper});
		act(() => result.current.setLocale("en"));
		expect(storageMock.getItem("booknest_locale")).toBe("en");
	});

	it("reads a stored locale from localStorage on mount", () => {
		storageMock.setItem("booknest_locale", "en");
		const {result} = renderHook(() => useLocale(), {wrapper});
		expect(result.current.locale).toBe("en");
	});

	it("falls back to default locale when stored value is invalid", () => {
		storageMock.setItem("booknest_locale", "fr"); // unsupported
		const {result} = renderHook(() => useLocale(), {wrapper});
		expect(result.current.locale).toBe(DEFAULT_LOCALE);
	});

	it("throws when useLocale is called outside a LocaleProvider", () => {
		// Suppress React's own error boundary logging during the test.
		const spy = vi.spyOn(console, "error").mockImplementation(() => {});
		expect(() => renderHook(() => useLocale())).toThrow(
			"useLocale must be used inside <LocaleProvider>",
		);
		spy.mockRestore();
	});
});

// ─── Translation dictionary smoke tests ───────────────────────────────────────

describe("Translation dictionaries", () => {
	const locales = ["en", "uk"] as const;

	it.each(locales)("%s has a nav section with all required keys", (locale) => {
		const t = TRANSLATIONS[locale];
		expect(typeof t.nav.home).toBe("string");
		expect(typeof t.nav.login).toBe("string");
		expect(typeof t.nav.register).toBe("string");
	});

	it.each(locales)("%s has a home section", (locale) => {
		const t = TRANSLATIONS[locale];
		expect(typeof t.home.heading).toBe("string");
		expect(typeof t.home.loading).toBe("string");
	});

	it.each(locales)("%s has a validation section with all required keys", (locale) => {
		const t = TRANSLATIONS[locale];
		expect(typeof t.validation.required).toBe("string");
		expect(typeof t.validation.invalidEmail).toBe("string");
		expect(typeof t.validation.minPassword).toBe("string");
	});

	it.each(locales)("%s passwordStrength has weak/medium/strong keys", (locale) => {
		const t = TRANSLATIONS[locale];
		expect(typeof t.passwordStrength.weak).toBe("string");
		expect(typeof t.passwordStrength.medium).toBe("string");
		expect(typeof t.passwordStrength.strong).toBe("string");
	});

	it("en and uk have the same top-level keys", () => {
		const enKeys = Object.keys(TRANSLATIONS.en).sort();
		const ukKeys = Object.keys(TRANSLATIONS.uk).sort();
		expect(enKeys).toEqual(ukKeys);
	});

	it("search.foundOf is a function that returns a string", () => {
		expect(typeof TRANSLATIONS.en.search.foundOf(5, 20)).toBe("string");
		expect(typeof TRANSLATIONS.uk.search.foundOf(5, 20)).toBe("string");
	});

	it("profile.savedHeading is a function that returns a string", () => {
		expect(typeof TRANSLATIONS.en.profile.savedHeading(3)).toBe("string");
		expect(typeof TRANSLATIONS.uk.profile.savedHeading(3)).toBe("string");
	});
});
