/**
 * Shared test utilities.
 *
 * `TestWrapper` — wraps children in every context provider required by the app:
 *   LocaleProvider → MemoryRouter → AuthContext
 *
 * All component tests that render routes, auth state, or translations should
 * use this wrapper. That way each test file stays focused on behaviour rather
 * than plumbing.
 */

import React, {type ReactNode} from "react";
import {MemoryRouter} from "react-router";
import {LocaleProvider} from "../i18n/LocaleContext";
import {AuthContext, type AuthContextValue} from "../context/authContext";
import {CartContext, type CartContextValue} from "../context/CartContext";
import type {User, Book} from "../schemas";
import {vi} from "vitest";

/** Default no-op auth context for tests that do not care about auth state. */
export function makeAuthContext(overrides?: Partial<AuthContextValue>): AuthContextValue {
	const {initializing, ...restOverrides} = overrides ?? {};
	return {
		user: null,
		loading: false,
		savedBooks: [],
		login: vi.fn(),
		register: vi.fn(),
		logout: vi.fn(),
		updateUser: vi.fn(),
		saveBook: vi.fn().mockReturnValue("saved"),
		unsaveBook: vi.fn(),
		...restOverrides,
		// `overrides.initializing` is `boolean | undefined` (optional on
		// `Partial<AuthContextValue>`), which isn't assignable to the
		// required `boolean` on `AuthContextValue` — resolve it to a real
		// boolean explicitly instead of spreading it in directly.
		initializing: initializing ?? false,
	};
}

/** A pre-built logged-in user for use in tests. */
export const MOCK_USER: User = {
	username: "test@example.com",
	nickname: "Tester",
};

/** A pre-built valid book for use in tests. */
export const MOCK_BOOK: Book = {
	id: 1,
	title: "Test Book Title",
	author: "Test Author",
	genre: "Фентезі",
	price: 199,
	description: "Test description text",
	publishedYear: 2024,
	pages: 320,
	stock: 5,
	coverImageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800",
	featured: false,
};

/** Default no-op cart context for tests that do not care about cart state. */
export function makeCartContext(overrides?: Partial<CartContextValue>): CartContextValue {
	return {
		cart: null,
		loading: false,
		error: null,
		refresh: vi.fn(),
		addItem: vi.fn().mockResolvedValue(undefined),
		updateQuantity: vi.fn().mockResolvedValue(undefined),
		removeItem: vi.fn().mockResolvedValue(undefined),
		...overrides,
	};
}

interface TestWrapperProps {
	children: ReactNode;
	authValue?: Partial<AuthContextValue>;
	cartValue?: Partial<CartContextValue>;
	initialRoute?: string;
}

/**
 * Full provider stack for component tests:
 *   LocaleProvider → MemoryRouter → AuthContext.Provider → CartContext.Provider
 *
 * @param authValue    - Optional AuthContext overrides (defaults to no user).
 * @param cartValue    - Optional CartContext overrides (defaults to an empty cart).
 * @param initialRoute - Initial path for MemoryRouter (default: '/').
 */
export function TestWrapper({
	children,
	authValue,
	cartValue,
	initialRoute = "/",
}: TestWrapperProps): React.ReactElement {
	const auth = makeAuthContext(authValue);
	const cart = makeCartContext(cartValue);
	return (
		<LocaleProvider>
			<MemoryRouter initialEntries={[initialRoute]}>
				<AuthContext.Provider value={auth}>
					<CartContext.Provider value={cart}>{children}</CartContext.Provider>
				</AuthContext.Provider>
			</MemoryRouter>
		</LocaleProvider>
	);
}

/**
 * Minimal wrapper for components that only need `LocaleProvider`
 * (no router, no auth).
 */
export function LocaleWrapper({children}: {children: ReactNode}): React.ReactElement {
	return <LocaleProvider>{children}</LocaleProvider>;
}
