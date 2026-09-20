/**
 * Root application component.
 *
 * Architecture decisions
 * ──────────────────────
 * • All page components are loaded lazily (`React.lazy`) to split the bundle
 *   into per-route chunks.  The initial load only downloads the home page.
 *
 * • A single <Suspense> wraps all routes.  The fallback is an accessible
 *   centered spinner so navigation never shows a blank screen.
 *
 * • <ErrorBoundary> wraps the entire route tree and resets on every
 *   navigation change (`resetKey={location.pathname}`).  This prevents a
 *   render error on page A from permanently breaking pages B, C, …
 *
 * • LocaleProvider (i18n) wraps AuthProvider so translated strings are
 *   available inside AuthProvider's render logic if needed.
 *
 * • useLocation() is called inside the inner component (AppRoutes) so it
 *   triggers inside the BrowserRouter context.
 */
import {lazy, Suspense, useEffect} from "react";
import {BrowserRouter, Routes, Route, useLocation} from "react-router";
import {LocaleProvider} from "./i18n/LocaleContext";
import {AuthProvider} from "./context/AuthProvider";
import {CartProvider} from "./context/CartProvider";
import {ErrorBoundary} from "./components/ErrorBoundary/ErrorBoundary";
import {Header} from "./components/Header/Header";
import {Spinner} from "./components/ui/Spinner";
import config from "./config";
import {PrivateRoute} from "./router/PrivateRoute";
import {AdminRoute} from "./router/AdminRoute";
import styles from "./components/Layout/Layout.module.css";

// ─── Lazy-loaded page components ─────────────────────────────────────────────
// Each import becomes a separate bundle chunk loaded only when that route is visited.
const HomePage = lazy(() =>
	import("./pages/HomePage/HomePage").then((m) => ({default: m.HomePage})),
);
const SearchPage = lazy(() =>
	import("./pages/SearchPage/SearchPage").then((m) => ({
		default: m.SearchPage,
	})),
);
const BookDetailPage = lazy(() =>
	import("./pages/BookDetailPage/BookDetailPage").then((m) => ({
		default: m.BookDetailPage,
	})),
);
const ProfilePage = lazy(() =>
	import("./pages/ProfilePage/ProfilePage").then((m) => ({
		default: m.ProfilePage,
	})),
);
const LoginForm = lazy(() =>
	import("./forms/LoginForm/LoginForm").then((m) => ({default: m.LoginForm})),
);
const RegisterForm = lazy(() =>
	import("./forms/RegisterForm/RegisterForm").then((m) => ({
		default: m.RegisterForm,
	})),
);
const ForgotPasswordPage = lazy(() =>
	import("./pages/ForgotPasswordPage/ForgotPasswordPage").then((m) => ({
		default: m.ForgotPasswordPage,
	})),
);
const ResetPasswordPage = lazy(() =>
	import("./pages/ResetPasswordPage/ResetPasswordPage").then((m) => ({
		default: m.ResetPasswordPage,
	})),
);
const CartPage = lazy(() =>
	import("./pages/CartPage/CartPage").then((m) => ({default: m.CartPage})),
);
const OrdersPage = lazy(() =>
	import("./pages/OrdersPage/OrdersPage").then((m) => ({default: m.OrdersPage})),
);
const OrderDetailPage = lazy(() =>
	import("./pages/OrdersPage/OrderDetailPage").then((m) => ({
		default: m.OrderDetailPage,
	})),
);
const NotFoundPage = lazy(() =>
	import("./pages/NotFoundPage/NotFoundPage").then((m) => ({
		default: m.NotFoundPage,
	})),
);
const AdminBooksPage = lazy(() =>
	import("./pages/AdminBooksPage/AdminBooksPage").then((m) => ({
		default: m.AdminBooksPage,
	})),
);

/** Full-screen loading fallback shown during code-split chunk download. */
function PageFallback(): React.ReactElement {
	// Rendered inside LocaleProvider — can use useLocale safely.
	const {t} = useLocale();
	return (
		<div
			style={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				minHeight: "50vh",
			}}
			aria-live="polite"
		>
			<Spinner size={36} label={t.detail.loading} />
		</div>
	);
}

/**
 * `/welcome` and `/api` are Rails routes, not pages of this SPA. GitHub Pages
 * can only serve static files, so `https://<user>.github.io/BookNest/api`
 * reaches the SPA (via 404.html) and is forwarded here to the real backend.
 * The backend origin is derived from VITE_API_URL, so it works both with
 * absolute URLs (production build) and with the Vite dev proxy (relative).
 */
function BackendRedirect({path}: {path: string}): React.ReactElement | null {
	useEffect(() => {
		const origin = new URL(config.API_BASE_URL, window.location.href).origin;
		window.location.replace(origin + path);
	}, [path]);
	return null;
}

/** Route declarations + ErrorBoundary that resets on navigation. */
function AppRoutes(): React.ReactElement {
	const {pathname} = useLocation();

	return (
		<ErrorBoundary resetKey={pathname}>
			<Suspense fallback={<PageFallback />}>
				<Routes>
					<Route path="/" element={<HomePage />} />
					<Route path="/search" element={<SearchPage />} />
					<Route path="/book/:id" element={<BookDetailPage />} />
					<Route path="/login" element={<LoginForm />} />
					<Route path="/register" element={<RegisterForm />} />
					<Route path="/forgot-password" element={<ForgotPasswordPage />} />
					<Route path="/reset-password" element={<ResetPasswordPage />} />
					<Route path="/cart" element={<CartPage />} />
					<Route
						path="/orders"
						element={
							<PrivateRoute>
								<OrdersPage />
							</PrivateRoute>
						}
					/>
					<Route
						path="/orders/:id"
						element={
							<PrivateRoute>
								<OrderDetailPage />
							</PrivateRoute>
						}
					/>
					<Route
						path="/profile"
						element={
							<PrivateRoute>
								<ProfilePage />
							</PrivateRoute>
						}
					/>
					<Route
						path="/admin/books"
						element={
							<AdminRoute>
								<AdminBooksPage />
							</AdminRoute>
						}
					/>
					<Route
						path="/welcome"
						element={<BackendRedirect path="/welcome" />}
					/>
					<Route path="/api" element={<BackendRedirect path="/api" />} />
					<Route path="*" element={<NotFoundPage />} />
				</Routes>
			</Suspense>
		</ErrorBoundary>
	);
}

const BASE = import.meta.env.BASE_URL;

export default function App(): React.ReactElement {
	return (
		<BrowserRouter basename={BASE}>
			<LocaleProvider>
				<AuthProvider>
					<CartProvider>
						<div className={styles.wrapper}>
							<Header />
							<main className={styles.main}>
								<AppRoutes />
							</main>
							<Footer />
						</div>
					</CartProvider>
				</AuthProvider>
			</LocaleProvider>
		</BrowserRouter>
	);
}

/** Footer extracted to its own function to keep App readable. */
import {useLocale} from "./i18n/LocaleContext";
function Footer(): React.ReactElement {
	const {t} = useLocale();
	return (
		<footer className={styles.footer}>
			<p className={styles.footerTitle}>{t.layout.footerTitle}</p>
			<p className={styles.footerSub}>{t.layout.footerSub}</p>
		</footer>
	);
}
