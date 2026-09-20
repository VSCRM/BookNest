import {Spinner} from "../../components/ui/Spinner";
import {BookLayout} from "../../components/BookLayout/BookLayout";
import styles from "./BookDetailPage.module.css";

export function DetailLoading(): React.ReactElement {
	return (
		<BookLayout>
			<div className={styles.notFound} role="status">
				<Spinner size={36} label="Завантаження книги…" />
			</div>
		</BookLayout>
	);
}
