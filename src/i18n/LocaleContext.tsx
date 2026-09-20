/**
 * @module i18n/LocaleContext
 *
 * Provides locale state and the `t()` translation helper to the entire
 * component tree via React Context.
 *
 * Usage
 * ─────
 *   // In any component:
 *   const { t, locale, setLocale } = useLocale();
 *   <h1>{t.home.heading}</h1>
 *   <button onClick={() => setLocale('en')}>EN</button>
 */

import {createContext, useContext, useState, useCallback, type ReactNode} from "react";
import {
	TRANSLATIONS,
	LOCALE_STORAGE_KEY,
	DEFAULT_LOCALE,
	type Locale,
} from "./translations";
import type {en} from "./translations";

/** Shape of the value provided by LocaleContext. */
interface LocaleContextValue {
	/** The active locale code ('en' | 'uk'). */
	locale: Locale;
	/** The full translation dictionary for the active locale. */
	t: typeof en;
	/** Persists and applies a new locale choice. */
	setLocale: (locale: Locale) => void;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

/** Reads the stored locale from localStorage, falling back to DEFAULT_LOCALE. */
function readStoredLocale(): Locale {
	try {
		const raw = localStorage.getItem(LOCALE_STORAGE_KEY);
		if (raw === "en" || raw === "uk") return raw;
	} catch {
		// localStorage blocked (e.g. private browsing with strict settings)
	}
	return DEFAULT_LOCALE;
}

interface LocaleProviderProps {
	children: ReactNode;
}

/** Wrap your application root with this provider to enable i18n support. */
export function LocaleProvider({children}: LocaleProviderProps): React.ReactElement {
	const [locale, setLocaleState] = useState<Locale>(readStoredLocale);

	const setLocale = useCallback((newLocale: Locale): void => {
		try {
			localStorage.setItem(LOCALE_STORAGE_KEY, newLocale);
		} catch {
			// ignore if storage is unavailable
		}
		setLocaleState(newLocale);
	}, []);

	const value: LocaleContextValue = {
		locale,
		t: TRANSLATIONS[locale],
		setLocale,
	};

	return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

/**
 * Hook for consuming LocaleContext.
 * @throws {Error} If called outside of <LocaleProvider>.
 */
export function useLocale(): LocaleContextValue {
	const ctx = useContext(LocaleContext);
	if (!ctx) throw new Error("useLocale must be used inside <LocaleProvider>");
	return ctx;
}
