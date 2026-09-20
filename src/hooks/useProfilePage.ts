import {useState, useEffect, useRef} from "react";
import {useNavigate} from "react-router";
import {useAuth} from "./useAuth";
import {useEditProfileForm} from "./useEditProfileForm";
import type {UpdateUserPayload} from "../services/authService";

export function useProfilePage() {
	const {user, logout, updateUser, loading} = useAuth();
	const navigate = useNavigate();
	const [editing, setEditing] = useState(false);
	const [saveError, setSaveError] = useState("");
	const [savedType, setSavedType] = useState<"nickname" | "password" | "both" | null>(
		null,
	);
	const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(() => {
		return () => {
			if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
		};
	}, []);

	const handleLogout = (): void => {
		logout();
		void navigate("/");
	};

	/** Persist profile changes and show a success toast for 3.5 s. */
	const handleSave = async (payload: UpdateUserPayload): Promise<void> => {
		setSaveError("");
		try {
			await updateUser(payload);
		} catch (err) {
			setSaveError((err as Error)?.message ?? "Не вдалося зберегти зміни.");
			return;
		}

		if (payload.nickname && payload.password) setSavedType("both");
		else if (payload.nickname) setSavedType("nickname");
		else setSavedType("password");

		setEditing(false);

		if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
		toastTimerRef.current = setTimeout(() => {
			setSavedType(null);
			toastTimerRef.current = null;
		}, 3500);
	};

	const editForm = useEditProfileForm(user, handleSave);

	const toggleEditing = (): void => setEditing((prev) => !prev);
	const closeEditing = (): void => setEditing(false);

	return {
		user,
		loading,
		editing,
		savedType,
		saveError,
		handleLogout,
		handleSave,
		toggleEditing,
		closeEditing,
		editForm,
	};
}
