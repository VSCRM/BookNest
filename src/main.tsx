/**
 * Application entry point.
 *
 * Initialisation order:
 * 1. Generate CSRF token so it is ready before any form submission.
 * 2. Mount the React tree.
 */
import {StrictMode} from "react";
import {createRoot} from "react-dom/client";
import {getCsrfToken} from "./security/csrf";
import App from "./App";
import "./styles/global.css";

// Initialise CSRF token before first render so it is available in sessionStorage
// before any form component mounts.
getCsrfToken();

const rootEl = document.getElementById("root");
if (!rootEl) throw new Error("Root element #root not found in DOM.");

createRoot(rootEl).render(
	<StrictMode>
		<App />
	</StrictMode>,
);
