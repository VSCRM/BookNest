/**
 * Small "Found X books" label shown below the filters.
 */
import {useLocale} from "../../i18n/LocaleContext";

interface HomeResultCountProps {
	count: number;
}

export function HomeResultCount({count}: HomeResultCountProps): React.ReactElement {
	const {t} = useLocale();
	return (
		<p
			style={{
				fontFamily: "var(--font-mono)",
				fontSize: 12,
				color: "var(--color-gray)",
				textTransform: "uppercase",
				marginBottom: 20,
			}}
		>
			{t.home.found} <strong>{count}</strong> {t.home.books}
		</p>
	);
}
