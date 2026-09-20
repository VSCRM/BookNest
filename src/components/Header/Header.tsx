import {useNavigate} from "react-router";
import {useLocale} from "../../i18n/LocaleContext";
import {formatDate} from "../../utils/formatDate";
import {LanguageSwitcher} from "../LanguageSwitcher/LanguageSwitcher";
import {Logo} from "./Logo";
import {Navigation} from "./Navigation";
import {TopBar} from "./TopBar";
import styles from "./Header.module.css";

export function Header(): React.ReactElement {
	const navigate = useNavigate();
	const {locale} = useLocale();

	// Re-computed whenever locale changes — formatDate is locale-aware.
	const date = formatDate(new Date().toISOString().slice(0, 10), locale);

	return (
		<header className={styles.header} role="banner">
			<TopBar date={date} />
			<div className={styles.main}>
				<Logo onLogoClick={() => void navigate("/")} />
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						alignItems: "flex-end",
						gap: 8,
					}}
				>
					<LanguageSwitcher />
				</div>
			</div>
			<Navigation />
		</header>
	);
}
