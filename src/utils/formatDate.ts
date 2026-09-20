/**
 * Locale-aware date formatter.
 *
 * Formatters are cached per locale to avoid creating a new Intl instance on
 * every render. The cache is keyed by locale string ('en', 'uk', …).
 *
 * @example
 *   formatDate('2026-06-10', 'uk') -> a localized long-form date string
 *   formatDate('2026-06-10', 'en') → 'Wednesday, June 10, 2026'
 */

import type {Locale} from "../i18n/translations";

/** BCP-47 tags for each app locale. */
const BCP47: Record<Locale, string> = {
	uk: "uk-UA",
	en: "en-US",
};

const FORMATTER_CACHE = new Map<string, Intl.DateTimeFormat>();

function getFormatter(locale: Locale): Intl.DateTimeFormat {
	const tag = BCP47[locale];
	if (!FORMATTER_CACHE.has(tag)) {
		FORMATTER_CACHE.set(
			tag,
			new Intl.DateTimeFormat(tag, {
				weekday: "long",
				day: "numeric",
				month: "long",
				year: "numeric",
			}),
		);
	}
	return FORMATTER_CACHE.get(tag)!;
}

export function formatDate(iso: string, locale: Locale = "uk"): string {
	try {
		const date = new Date(`${iso}T00:00:00`);
		if (isNaN(date.getTime())) return iso;
		const formatted = getFormatter(locale).format(date);
		// uk-UA weekday starts lowercase — capitalise for consistency.
		return formatted.charAt(0).toUpperCase() + formatted.slice(1);
	} catch {
		return iso;
	}
}
