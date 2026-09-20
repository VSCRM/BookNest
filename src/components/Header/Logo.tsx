/**
 * Site logo button — open-book SVG icon + brand name.
 */
import {useLocale} from "../../i18n/LocaleContext";
import styles from "./Header.module.css";

interface LogoProps {
	onLogoClick: () => void;
}

export function Logo({onLogoClick}: LogoProps): React.ReactElement {
	const {t} = useLocale();
	return (
		<div className={styles.main}>
			<button
				className={styles.logo}
				onClick={onLogoClick}
				aria-label={t.nav.logoAlt}
			>
				<svg
					className={styles.logoImg}
					viewBox="0 0 80 80"
					xmlns="http://www.w3.org/2000/svg"
					aria-hidden="true"
				>
					<rect width="80" height="80" rx="8" fill="#d4a574" />
					<path
						d="M40 22c-6-4-16-5-22-3v34c6-2 16-1 22 3 6-4 16-5 22-3V19c-6-2-16-1-22 3z"
						fill="none"
						stroke="#2c2416"
						strokeWidth="3"
						strokeLinejoin="round"
					/>
					<line
						x1="40"
						y1="22"
						x2="40"
						y2="56"
						stroke="#2c2416"
						strokeWidth="3"
					/>
					<line
						x1="22"
						y1="26"
						x2="34"
						y2="24"
						stroke="#2c2416"
						strokeWidth="2"
					/>
					<line
						x1="22"
						y1="32"
						x2="34"
						y2="30"
						stroke="#2c2416"
						strokeWidth="2"
					/>
					<line
						x1="46"
						y1="24"
						x2="58"
						y2="26"
						stroke="#2c2416"
						strokeWidth="2"
					/>
					<line
						x1="46"
						y1="30"
						x2="58"
						y2="32"
						stroke="#2c2416"
						strokeWidth="2"
					/>
				</svg>
				<h1 className={styles.logoTitle}>BOOKNEST</h1>
			</button>
		</div>
	);
}
