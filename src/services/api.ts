/**
 * Shared Axios instance.
 *
 * Security middleware applied here (once) for all requests:
 * ─────────────────────────────────────────────────────────
 * 1. CSRF token header on every state-mutating request.
 * 2. Request timeout (10 s) — prevents hanging connections.
 * 3. Credentials: true — sends session cookies cross-origin when the backend
 *    sets CORS allow-credentials.
 *
 * Error normalisation:
 * ────────────────────
 * The response interceptor extracts a human-readable message from any API
 * error shape so callers never have to inspect axios internals.
 */
import axios, {type AxiosError, type InternalAxiosRequestConfig} from "axios";
import {getCsrfToken} from "../security/csrf";
import {logger} from "../utils/logger";
import config from "../config";

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS", "TRACE"]);

export const api = axios.create({
	baseURL: config.API_BASE_URL,
	timeout: 10_000,
	withCredentials: true,
	headers: {
		"Content-Type": "application/json",
		Accept: "application/json",
	},
});

/** Separate Axios instance for the Spring Boot authentication microservice.
 *  Kept apart from `api` (the Rails catalog client) because it targets a
 *  different origin/port and carries the `booknest_jwt` cookie instead of
 *  a Rails session cookie. */
export const authApi = axios.create({
	baseURL: config.AUTH_BASE_URL,
	timeout: 10_000,
	withCredentials: true,
	headers: {
		"Content-Type": "application/json",
		Accept: "application/json",
	},
});

/** Attach CSRF token to every non-safe request. */
function attachCsrfInterceptor(client: typeof api): void {
	client.interceptors.request.use((requestConfig: InternalAxiosRequestConfig) => {
		const method = (requestConfig.method ?? "GET").toUpperCase();
		if (!SAFE_METHODS.has(method)) {
			requestConfig.headers["X-CSRF-Token"] = getCsrfToken();
		}
		return requestConfig;
	});
}

/** Config shape stamped onto a request once it's been retried after a refresh,
 *  so a request that still 401s post-refresh fails instead of looping forever. */
type RetriableConfig = InternalAxiosRequestConfig & {_retriedAfterRefresh?: boolean};

/**
 * The access-token cookie (`booknest_jwt`) lives only 15 minutes and nothing
 * else was calling `POST /api/auth/refresh` — so a session that was valid at
 * login started failing with 401 (admin panel, orders, saved books, …) the
 * moment the access token expired, even though the httpOnly refresh cookie
 * was still good. Concurrent 401s share a single in-flight refresh call
 * instead of each firing their own.
 */
let refreshInFlight: Promise<boolean> | null = null;

function requestRefresh(): Promise<boolean> {
	if (!refreshInFlight) {
		refreshInFlight = authApi
			.post<{success: boolean}>("/refresh")
			// auth-service always replies 200, even on failure (see
			// AuthController) — the *body*'s `success` field is the real
			// signal. Treating any 200 as "refreshed" (the previous bug)
			// meant a truly-expired/missing refresh token was reported as
			// a successful refresh, so the original request got retried
			// against still-stale cookies and failed again — but by then
			// `isAuthExpired` never got set, so AuthProvider never cleared
			// `user`, leaving the UI looking "logged in" while every
			// authenticated call kept 401ing.
			.then((response) => response.data?.success === true)
			.catch(() => false)
			.finally(() => {
				refreshInFlight = null;
			});
	}
	return refreshInFlight;
}

/**
 * On a 401, tries one silent refresh-and-retry before giving up. Must run
 * *before* `attachErrorNormaliser` (see call order below) since that turns
 * the AxiosError into a plain Error, losing `error.config`/`error.response`
 * that this interceptor needs to retry the original request.
 */
function attachRefreshInterceptor(client: typeof api): void {
	client.interceptors.response.use(
		(response) => response,
		async (error: AxiosError) => {
			const original = error.config as RetriableConfig | undefined;
			const url = original?.url ?? "";
			// Never try to "refresh" the refresh call itself, or a failed
			// login/register (a 401 there means bad credentials, not an
			// expired token — refreshing wouldn't help and would just mask
			// the real error message).
			const skip =
				url.includes("/refresh") ||
				url.includes("/login") ||
				url.includes("/register");

			if (
				error.response?.status === 401 &&
				original &&
				!original._retriedAfterRefresh &&
				!skip
			) {
				original._retriedAfterRefresh = true;
				const refreshed = await requestRefresh();
				if (refreshed) {
					return client(original);
				}
				// Refresh token is also gone (expired/revoked) — the session
				// is genuinely over. Let AuthProvider know so `user` is
				// cleared and PrivateRoute/AdminRoute redirect to /login
				// instead of the UI looking "stuck" mid-request.
				window.dispatchEvent(new CustomEvent("booknest:auth-expired"));
				// Tag the error so callers (see attachErrorNormaliser, and any
				// page-level `.catch`) can tell "session ended, redirecting
				// you" apart from a genuine server/network failure and skip
				// rendering their own error UI for it — the redirect below
				// already handles it, so showing a raw error message first
				// would just flash confusing text right before navigating
				// away.
				(error as AxiosError & {isAuthExpired?: boolean}).isAuthExpired = true;
			}

			return Promise.reject(error);
		},
	);
}

/**
 * Error shape every caller of `api`/`authApi` actually receives (see
 * `attachErrorNormaliser` below). Lets a page distinguish "session ended,
 * you're being redirected — don't also show an error" from "genuine
 * server/network failure — show a friendly retry state" without having to
 * inspect axios internals itself.
 */
export class ApiError extends Error {
	/** HTTP status code, when the server responded at all (undefined for network/timeout failures). */
	status?: number;
	/** True if this 401 already triggered the global auth-expired redirect — don't render your own error UI for it. */
	isAuthExpired?: boolean;
	/** True when the request never reached a server (offline, CORS block, connection refused, timeout). */
	isNetworkError?: boolean;

	constructor(
		message: string,
		opts: Partial<Pick<ApiError, "status" | "isAuthExpired" | "isNetworkError">>,
	) {
		super(message);
		this.name = "ApiError";
		Object.assign(this, opts);
	}
}

/** Normalise error responses into a plain Error with a readable message. */
function attachErrorNormaliser(client: typeof api, label: string): void {
	client.interceptors.response.use(
		(response) => response,
		(
			error: AxiosError<{message?: string; error?: string}> & {
				isAuthExpired?: boolean;
			},
		) => {
			// A retried-after-refresh request (see attachRefreshInterceptor)
			// re-enters this same client's interceptor chain. If that retry
			// also fails, it has *already* been normalised into a plain
			// `Error` by this same function once; without this guard it gets
			// wrapped a second time here, losing `error.config`/`error.response`
			// and logging a bogus `{url: undefined, status: undefined, ...}`
			// line right after the real one. Plain Errors aren't AxiosErrors
			// (no `isAxiosError` flag), so just pass them through unchanged.
			if (!error.isAxiosError) {
				return Promise.reject(error);
			}

			// A request cancelled via AbortController (e.g. useBook's cleanup
			// aborting a stale fetch on locale change, or React StrictMode's
			// dev-mode double-invoke) is not a failure — it's the app itself
			// choosing not to need the response anymore. Logging it as an
			// "error" just adds red noise to the console for something that
			// worked exactly as intended.
			if (axios.isCancel(error)) {
				return Promise.reject(error);
			}

			// The Rails backend replies with `{error: "..."}`, while the
			// Spring Boot auth-service replies with `{success:false, message: "..."}`.
			// Without this fallback, every Rails 4xx (401 on /orders, /admin/books
			// validation errors, etc.) fell through to axios's generic
			// "Request failed with status code 401" instead of the backend's
			// actual reason.
			const message =
				error.response?.data?.message ??
				error.response?.data?.error ??
				error.message ??
				"Unknown network error";

			// `GET /me` 401ing just means "not logged in" — AuthProvider's own
			// `.catch(() => {})` already treats it as the expected guest state,
			// so logging it as a red `error` is just noise. `PUT /me` (profile
			// update) 401ing is still a real problem and stays at `error`.
			const isExpectedGuestCheck =
				error.response?.status === 401 &&
				(error.config?.url ?? "") === "/me" &&
				(error.config?.method ?? "").toLowerCase() === "get";

			logger[isExpectedGuestCheck ? "debug" : "error"](
				`${label} request failed`,
				{
					url: error.config?.url,
					status: error.response?.status,
					message,
				},
				label,
			);

			return Promise.reject(
				new ApiError(message, {
					status: error.response?.status,
					isAuthExpired: error.isAuthExpired === true,
					// No `error.response` at all means the request never got a
					// reply — offline, CORS rejected it, connection refused
					// (backend still starting up), or it timed out.
					isNetworkError: !error.response,
				}),
			);
		},
	);
}

attachCsrfInterceptor(api);
attachRefreshInterceptor(api);
attachErrorNormaliser(api, "api");
attachCsrfInterceptor(authApi);
attachRefreshInterceptor(authApi);
attachErrorNormaliser(authApi, "authApi");
