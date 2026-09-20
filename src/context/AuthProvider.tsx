import {useState, useCallback, useEffect, useRef, type ReactNode} from "react";
import {AuthContext, type AuthContextValue} from "./authContext";
import {readLocalUser} from "./readLocalUser";
import {readSavedBooks} from "./readSavedBooks";
import {mergePendingBook} from "./mergePendingBook";
import {useAuthSync} from "../hooks/useAuthSync";
import {useLogin} from "../hooks/useLogin";
import {useRegister} from "../hooks/useRegister";
import {useBookActions} from "../hooks/useBookActions";
import {useUpdateUser} from "../hooks/useUpdateUser";
import {listenForSessionSync, createSession} from "../security/sessionGuard";
import {authService} from "../services/authService";
import {savedBooksService} from "../services/savedBooksService";
import config from "../config";
import {logger} from "../utils/logger";
import type {User, Book} from "../schemas";

interface AuthProviderProps {
	children: ReactNode;
}

/**
 * Top-level authentication context provider.
 * Manages the current user, saved books, and auth operations.
 * Subscribes to cross-tab session events via BroadcastChannel so that
 * logging in/out in one tab is immediately reflected in all others.
 */
export function AuthProvider({children}: AuthProviderProps): React.ReactElement {
	const [user, setUser] = useState<User | null>(() => readLocalUser());
	const [loading, setLoading] = useState<boolean>(false);
	// Starts true (skipped entirely for the mock backend, which has nothing
	// to hydrate from). Flipped to false once the /me check below settles,
	// whether it finds a session or not.
	const [initializing, setInitializing] = useState<boolean>(!config.USE_MOCK);
	const [savedBooks, setSavedBooks] = useState<Book[]>(() =>
		readSavedBooks(readLocalUser()?.username),
	);

	// Keep savedBooks in sync whenever the user or their storage changes.
	useAuthSync(user, savedBooks, setSavedBooks);

	useEffect(() => {
		// Listen for session events broadcast from other tabs.
		const cleanup = listenForSessionSync(
			() => {
				// Another tab logged in — refresh local state from storage.
				const refreshed = readLocalUser();
				if (refreshed) {
					setUser(refreshed);
					setSavedBooks(readSavedBooks(refreshed.username));
				}
			},
			() => {
				// Another tab logged out — clear local state.
				setUser(null);
				setSavedBooks([]);
			},
		);
		return cleanup;
	}, []);

	// Re-hydrate the session from the `booknest_jwt` cookie on mount.
	// This is what makes a Google OAuth login "take": that flow is a full
	// page redirect (no JS callback), so `bp_user` in localStorage is never
	// set by it — the cookie is the only signal we get back. Also covers
	// the case of the localStorage cache having gone stale (e.g. access
	// token expired between visits) while the cookie is still valid.
	useEffect(() => {
		if (config.USE_MOCK) return;

		let cancelled = false;

		authService
			.me()
			.then((result) => {
				if (cancelled || !result.success) return;

				setUser((current) => {
					if (current && current.username === result.user.username) {
						return current;
					}
					createSession(result.user.username);
					return result.user;
				});

				savedBooksService
					.getAll(result.user.username)
					.then((books) => {
						// A book saved while logged out (see useSaveBook.ts) is
						// only ever restored here — this /me effect is what
						// runs after a Google OAuth redirect, since that login
						// never goes through useLogin.ts's own pending-book
						// merge. Without this, "save a book -> sign in with
						// Google" silently dropped it: the person landed back
						// on /profile with an empty saved list even though the
						// server-side save/login itself succeeded.
						if (!cancelled) {
							setSavedBooks(mergePendingBook(result.user.username, books));
						}
					})
					.catch((err) => {
						logger.error(
							"AuthProvider: failed to load saved books after /me sync",
							err,
							"AuthProvider",
						);
					});
			})
			.catch(() => {
				// Not authenticated (no/expired cookie) or auth-service
				// unreachable — stay logged out, nothing to recover from here.
			})
			.finally(() => {
				if (!cancelled) setInitializing(false);
			});

		return () => {
			cancelled = true;
		};
	}, []);

	// Tell the rest of the app (currently: CartProvider) whenever the signed-in
	// identity actually changes — login, logout, or switching accounts.
	// The cart lives on a *different* backend/cookie than auth (Rails session
	// vs. the Spring Boot `booknest_jwt`), so nothing else ever learns that a
	// login happened. Without this, a cart fetched while a guest stays cached
	// after login and the checkout page can't tell it's now looking at a
	// stranger's (or an empty) account cart. `prevUsernameRef` starts
	// `undefined` so the very first render (including hydration from
	// `bp_user`/the `/me` cookie check) never fires this — only a *change*
	// after mount should.
	const prevUsernameRef = useRef<string | null | undefined>(undefined);
	useEffect(() => {
		const next = user?.username ?? null;
		if (prevUsernameRef.current !== undefined && prevUsernameRef.current !== next) {
			window.dispatchEvent(new CustomEvent("booknest:auth-changed"));
		}
		prevUsernameRef.current = next;
	}, [user]);

	const login = useLogin(setUser, setSavedBooks, setLoading);
	const register = useRegister(setUser, setSavedBooks, setLoading);
	const updateUser = useUpdateUser(user, setUser, setLoading);
	const {saveBook, unsaveBook} = useBookActions(user, setSavedBooks);

	const logout = useCallback(() => {
		// Fire-and-forget: tells the server to clear the httpOnly
		// booknest_jwt / booknest_refresh cookies (see authService.logout).
		// Local state below clears immediately regardless of whether this
		// call succeeds, so the UI never waits on it.
		void authService.logout();
		setUser(null);
		setSavedBooks([]);
	}, []);

	// api.ts's response interceptor dispatches this when a 401 survives a
	// silent refresh attempt (i.e. the refresh cookie itself is expired/
	// revoked) — clear local state so PrivateRoute/AdminRoute send the
	// person back to /login instead of the UI staying "logged in" while
	// every request keeps failing.
	useEffect(() => {
		const handleAuthExpired = () => logout();
		window.addEventListener("booknest:auth-expired", handleAuthExpired);
		return () =>
			window.removeEventListener("booknest:auth-expired", handleAuthExpired);
	}, [logout]);

	const value: AuthContextValue = {
		user,
		loading,
		initializing,
		savedBooks,
		login,
		register,
		logout,
		updateUser,
		saveBook,
		unsaveBook,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
