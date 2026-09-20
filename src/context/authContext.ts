import {createContext, useContext} from "react";
import type {User, Book, AuthResult, ForgotPasswordResponse} from "../schemas";
import type {UpdateUserPayload} from "../services/authService";

/** All values exposed by the AuthContext to consumers. */
export interface AuthContextValue {
	user: User | null;
	loading: boolean;
	/**
	 * True until the initial `/me` cookie check (see AuthProvider) has
	 * resolved. A Google login is a full-page redirect, so `user` starts
	 * as `null` on first render even for someone who is genuinely logged
	 * in — route guards must wait for this to become `false` before
	 * treating `user === null` as "not authenticated", or they bounce a
	 * logged-in person to /login during that window.
	 */
	initializing: boolean;
	savedBooks: Book[];
	login: (email: string, password: string) => Promise<AuthResult>;
	register: (email: string, password: string, nickname: string) => Promise<AuthResult>;
	logout: () => void;
	updateUser: (payload: UpdateUserPayload) => Promise<AuthResult>;
	saveBook: (book: Book) => "saved" | "redirect";
	unsaveBook: (id: number) => void;
	forgotPassword?: (email: string) => Promise<ForgotPasswordResponse>;
}

/** React context — initialised to `null`; always consumed through `useAuth`. */
export const AuthContext = createContext<AuthContextValue | null>(null);

/** Type-safe hook for consuming AuthContext. Throws if used outside AuthProvider. */
export function useAuth(): AuthContextValue {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error("useAuth must be inside <AuthProvider>");
	return ctx;
}
