import {useLocale} from "../../i18n/LocaleContext";
import type {Locale} from "../../i18n/translations";

const LOCALES: {code: Locale; label: string}[] = [
	{code: "uk", label: "UA"},
	{code: "en", label: "EN"},
];

export function LanguageSwitcher(): React.ReactElement {
	const {locale, setLocale} = useLocale();

	return (
		<div role="group" aria-label="Language / Мова" style={{display: "flex", gap: 4}}>
			{LOCALES.map(({code, label}) => (
				<button
					key={code}
					type="button"
					onClick={() => setLocale(code)}
					aria-pressed={locale === code}
					aria-label={`Switch to ${label}`}
					disabled={locale === code}
					style={{
						padding: "4px 10px",
						fontFamily: "var(--font-mono)",
						fontSize: 11,
						fontWeight: 700,
						textTransform: "uppercase",
						border: "2px solid var(--color-bg)",
						background:
							locale === code ? "var(--color-accent)" : "transparent",
						color: locale === code ? "var(--color-dark)" : "var(--color-bg)",
						cursor: locale === code ? "default" : "pointer",
						letterSpacing: "0.5px",
						transition: "all 0.2s ease",
					}}
				>
					{label}
				</button>
			))}
		</div>
	);
}
