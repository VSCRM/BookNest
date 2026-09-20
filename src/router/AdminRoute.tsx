import {Navigate, useLocation} from "react-router";
import {useAuth} from "../hooks/useAuth";
import type {ReactNode} from "react";

interface AdminRouteProps {
	children: ReactNode;
}

/**
 * Wraps a route that requires an authenticated *admin* user
 * (`user.role === 'admin'`, as reported by the auth-service's `UserDto`).
 * Not logged in → /login (same as PrivateRoute). Logged in but not an
 * admin → sent back to the catalog instead of seeing a 403-ish page,
 * since a regular customer landing here is almost always a stale/shared
 * link rather than someone testing access on purpose.
 */
export function AdminRoute({children}: AdminRouteProps): React.ReactElement | null {
	const {user, initializing} = useAuth();
	const location = useLocation();

	// Same race as PrivateRoute: don't judge "not logged in" until the
	// initial /me cookie check has actually finished.
	if (initializing) return null;

	if (!user) {
		return <Navigate to="/login" state={{from: location}} replace />;
	}

	if (user.role !== "admin") {
		return <Navigate to="/" replace />;
	}

	return <>{children}</>;
}
