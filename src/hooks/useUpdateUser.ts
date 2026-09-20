import {useCallback, type Dispatch, type SetStateAction} from "react";
import {authService, type UpdateUserPayload} from "../services/authService";
import {useLocale} from "../i18n/LocaleContext";
import {resolveAuthError} from "../utils/resolveAuthError";
import type {User, AuthResult} from "../schemas";

/**
 * Returns a memoised `updateUser` function that calls the auth service
 * and updates the user in context on success.
 */
export function useUpdateUser(
	user: User | null,
	setUser: Dispatch<SetStateAction<User | null>>,
	setLoading: Dispatch<SetStateAction<boolean>>,
): (newData: UpdateUserPayload) => Promise<AuthResult> {
	const {t} = useLocale();
	return useCallback(
		async (newData: UpdateUserPayload): Promise<AuthResult> => {
			if (!user)
				return {success: false, message: resolveAuthError("not_authorized", t)};
			setLoading(true);
			try {
				const result = await authService.updateUser(user.username, newData);
				if (result.success) setUser(result.user);
				return result;
			} finally {
				setLoading(false);
			}
		},
		[user, setUser, setLoading, t],
	);
}
