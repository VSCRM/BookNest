import styles from "./BookCard.module.css";

export function CardTitle({
	title,
	size,
}: {
	title: string;
	size?: string;
}): React.ReactElement {
	return (
		<h2 className={styles.title} style={{fontSize: size}}>
			{title}
		</h2>
	);
}
