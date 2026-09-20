/**
 * Vite configuration for the BookNest storefront.
 *
 * Bundle strategy — manual chunks for optimal caching:
 * ─────────────────────────────────────────────────────
 * vendor-react   react + react-dom + react-router  (very stable, cache for months)
 * vendor-utils   axios + zod                        (stable, cache for months)
 * vendor-ui      lucide-react (all icons)           (stable, cache for months)
 * vendor-crypto  bcrypt-ts                          (stable, cache for months)
 * index          app shell: Header, Auth, i18n      (changes per deploy)
 *
 * Page components are lazy-loaded from App.tsx → each becomes its own chunk
 * that is downloaded only when that route is visited.
 */
import {defineConfig} from "vitest/config";
import react from "@vitejs/plugin-react";
import {fileURLToPath, URL} from "node:url";

/**
 * Forwards backend-only routes through this app's own origin, so the
 * browser never has to switch ports to reach them:
 *   /welcome, /rubyback, /api* (non-/v1 paths too, e.g. the Swagger
 *   redirect) -> BookNest Rails (8080)
 *   /api/auth                 -> Spring Boot auth-service (9000)
 * `/api/auth` is listed before the broader `/api` so it wins the match
 * (Vite checks proxy entries in the order they're defined).
 * Shared by both `server` (vite dev) and `preview` (serves the built
 * `dist/`) below — proxying is a dev-tooling convenience only, so a real
 * deployment still needs its own reverse proxy (nginx, etc.) doing the
 * equivalent routing in front of the static build.
 */
const BACKEND_PROXY = {
	"/api/auth": {
		target: "http://localhost:9000",
		changeOrigin: true,
	},
	"/api": {
		target: "http://localhost:8080",
		changeOrigin: true,
	},
	"/welcome": {
		target: "http://localhost:8080",
		changeOrigin: true,
	},
	"/rubyback": {
		target: "http://localhost:8080",
		changeOrigin: true,
	},
};

export default defineConfig({
	// GitHub Pages project site: this repo (vscrm/BookNest) is served at
	// https://vscrm.github.io/BookNest/, not the domain root, so every
	// asset URL and the router's basename (App.tsx reads BASE via
	// import.meta.env.BASE_URL) must be prefixed with /BookNest/. Same
	// sub-path locally too (http://localhost:5174/BookNest/), so one
	// constant covers dev, build and preview.
	base: "/BookNest/",

	plugins: [react()],

	resolve: {
		alias: {"@": fileURLToPath(new URL("./src", import.meta.url))},
	},

	build: {
		chunkSizeWarningLimit: 600,
		rollupOptions: {
			output: {
				manualChunks: (id: string): string | undefined => {
					if (
						id.includes("node_modules/react") ||
						id.includes("node_modules/react-dom") ||
						id.includes("react-router")
					)
						return "vendor-react";
					if (
						id.includes("node_modules/axios") ||
						id.includes("node_modules/zod")
					)
						return "vendor-utils";
					if (
						id.includes("node_modules/lucide-react") ||
						id.includes("lucide-react")
					)
						return "vendor-ui";
					if (id.includes("node_modules/bcrypt-ts")) return "vendor-crypto";
					return undefined;
				},
			},
		},
	},

	server: {
		port: 5174,
		open: true,
		// Lets the browser talk to the Rails/Spring backends through this
		// dev server's own origin (http://localhost:5174) instead of
		// requiring a manual port switch to 8080/9000. Vite's Node process
		// forwards the request server-side — the browser never sees 8080.
		proxy: BACKEND_PROXY,
	},
	// Same proxy, mirrored for `npm run preview` (serves the production
	// `dist/` build). `server.proxy` above only applies to `vite dev` —
	// without this block, /welcome, /api and /rubyback would 404 the
	// moment you build instead of running the dev server.
	preview: {
		port: 4174,
		proxy: BACKEND_PROXY,
	},

	test: {
		globals: true,
		environment: "jsdom",
		setupFiles: "./src/tests/setup.ts",
	},
});
