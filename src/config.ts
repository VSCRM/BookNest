/**
 * Central application configuration.
 * Values are read from Vite environment variables at build time.
 * Set VITE_USE_MOCK=false in .env to switch to the real BookNest backends
 * (Rails for the catalog, Spring Boot for authentication).
 */
const config = {
	USE_MOCK: import.meta.env.VITE_USE_MOCK === "true",
	API_BASE_URL: import.meta.env.VITE_API_URL ?? "http://localhost:8080/api/v1",
	AUTH_BASE_URL: import.meta.env.VITE_AUTH_URL ?? "http://localhost:9000/api/auth",
	/**
	 * Root of the auth-service (no /api/auth suffix). Spring Security's
	 * OAuth2 client exposes the Google login redirect at
	 * `{AUTH_ROOT_URL}/oauth2/authorization/google` — that endpoint lives
	 * at the service root, not under the /api/auth REST prefix used for
	 * the JSON endpoints above.
	 */
	AUTH_ROOT_URL: import.meta.env.VITE_AUTH_ROOT_URL ?? "http://localhost:9000",
	MOCK_DELAY_MS: Number(import.meta.env.VITE_MOCK_DELAY_MS ?? 600),
} as const;

export default config;
