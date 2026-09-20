import {Navigate, useLocation} from "react-router";
import {useAuth} from "../hooks/useAuth";
import type {ReactNode} from "react";

interface PrivateRouteProps {
	children: ReactNode;
}

/**
 * Wraps a route that requires authentication.
 * Unauthenticated users are redirected to `/login`; the current location
 * is stored in router state so they are returned here after logging in.
 */
export function PrivateRoute({children}: PrivateRouteProps): React.ReactElement | null {
	const {user, initializing} = useAuth();
	const location = useLocation();

	// A Google login is a full page redirect, so on the very first render
	// after it `user` is still null while AuthProvider's /me check is in
	// flight — bouncing to /login here would kick out someone who is
	// actually logged in. Render nothing (briefly) until that settles.
	if (initializing) return null;

	if (!user) {
		return <Navigate to="/login" state={{from: location}} replace />;
	}

	return <>{children}</>;
}
