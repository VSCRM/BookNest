import {Pencil} from "lucide-react";
import type {User} from "../../schemas";
import {useLocale} from "../../i18n/LocaleContext";
import styles from "./ProfileInfo.module.css";

interface ProfileInfoProps {
	user: User | null;
	onEdit: () => void;
}

export function ProfileInfo({user, onEdit}: ProfileInfoProps): React.ReactElement {
	const {t} = useLocale();

	return (
		<div className={styles.wrap}>
			<div className={styles.avatar}>
				{user?.nickname?.[0] ?? user?.username?.[0] ?? "?"}
			</div>
			<div className={styles.details}>
				<h2 className={styles.nickname}>{user?.nickname ?? user?.username}</h2>
				<p className={styles.username}>@{user?.username}</p>
			</div>
			<button className={styles.editBtn} onClick={onEdit}>
				<Pencil size={14} aria-hidden="true" /> {t.profile.editBtn}
			</button>
		</div>
	);
}
