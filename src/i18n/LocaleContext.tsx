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

import {
	createContext,
	useContext,
	useState,
	useCallback,
	useEffect,
	type ReactNode,
} from "react";
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

/**
 * Keeps `<html lang="...">` in sync with the active locale.
 *
 * Native form controls — most notably `<input type="date">` — take their
 * calendar/placeholder localisation (day/month/year order, month names,
 * "dd.mm.yyyy" vs "mm/dd/yyyy" formatting) from the document's `lang`
 * attribute, not from our own i18n context. Without this, `index.html`'s
 * hardcoded `lang="uk"` never changes, so switching the app to English
 * leaves every native date field's placeholder in Ukrainian even though
 * the rest of the UI text updates correctly.
 */
function applyDocumentLang(locale: Locale): void {
	if (typeof document !== "undefined") {
		document.documentElement.lang = locale;
	}
}

interface LocaleProviderProps {
	children: ReactNode;
}

/** Wrap your application root with this provider to enable i18n support. */
export function LocaleProvider({children}: LocaleProviderProps): React.ReactElement {
	const [locale, setLocaleState] = useState<Locale>(readStoredLocale);

	// Sync on mount too: the stored/default locale may already differ from
	// index.html's static `lang="uk"` (e.g. a returning user whose choice
	// was persisted to localStorage as "en").
	useEffect(() => {
		applyDocumentLang(locale);
	}, [locale]);

	const setLocale = useCallback((newLocale: Locale): void => {
		try {
			localStorage.setItem(LOCALE_STORAGE_KEY, newLocale);
		} catch {
			// ignore if storage is unavailable
		}
		applyDocumentLang(newLocale);
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
