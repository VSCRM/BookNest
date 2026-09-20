import type {ReactNode} from "react";
import styles from "./AuthLayout.module.css";

interface AuthLayoutProps {
	children: ReactNode;
	title?: string;
}

export function AuthLayout({children, title}: AuthLayoutProps): React.ReactElement {
	return (
		<div className={styles.container}>
			{title && <h2 className={styles.title}>{title}</h2>}
			{children}
		</div>
	);
}
