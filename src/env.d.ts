/// <reference types="vite/client" />

interface ImportMetaEnv {
	/** Set to "false" to switch from the mock layer to the real REST API. */
	readonly VITE_USE_MOCK: string | undefined;
	/** Base URL for the real API, e.g. http://localhost:3001/api */
	readonly VITE_API_URL: string | undefined;
	/** Artificial delay (ms) injected by the mock service layer. */
	readonly VITE_MOCK_DELAY_MS: string | undefined;
	/** EmailJS service identifier. */
	readonly VITE_EMAILJS_SERVICE_ID: string | undefined;
	/** EmailJS email template identifier. */
	readonly VITE_EMAILJS_TEMPLATE_ID: string | undefined;
	/** EmailJS public API key. */
	readonly VITE_EMAILJS_PUBLIC_KEY: string | undefined;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
