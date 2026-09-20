/**
 * Structured logger.
 *
 * In production (`import.meta.env.PROD === true`) all output is suppressed to
 * prevent leaking internals.  In development every call is forwarded to the
 * native console so DevTools remain useful.
 *
 * Design rationale
 * ────────────────
 * • Single Responsibility: one place to toggle / extend logging strategy.
 * • Open/Closed: swap the implementation (e.g. send to Sentry) without
 *   touching any call-site.
 * • DRY: callers do `logger.error(...)` instead of `console.error(...)`.
 */

const IS_PROD = import.meta.env.PROD;

/** Structured log entry sent to the output adapter. */
interface LogEntry {
	level: "debug" | "info" | "warn" | "error";
	message: string;
	context?: string;
	/** Additional serialisable data for structured logging. */
	data?: unknown;
}

/**
 * Output adapter — replace with a remote service (Sentry, DataDog) in production.
 */
function emit(entry: LogEntry): void {
	if (IS_PROD) return; // suppress all output in production
	const prefix = `[${entry.level.toUpperCase()}]${entry.context ? ` [${entry.context}]` : ""}`;
	/* eslint-disable no-console */
	switch (entry.level) {
		case "debug":
			console.debug(prefix, entry.message, entry.data ?? "");
			break;
		case "info":
			console.info(prefix, entry.message, entry.data ?? "");
			break;
		case "warn":
			console.warn(prefix, entry.message, entry.data ?? "");
			break;
		case "error":
			console.error(prefix, entry.message, entry.data ?? "");
			break;
	}
	/* eslint-enable no-console */
}

export const logger = {
	debug: (message: string, data?: unknown, ctx?: string) =>
		emit({level: "debug", message, context: ctx, data}),
	info: (message: string, data?: unknown, ctx?: string) =>
		emit({level: "info", message, context: ctx, data}),
	warn: (message: string, data?: unknown, ctx?: string) =>
		emit({level: "warn", message, context: ctx, data}),
	error: (message: string, data?: unknown, ctx?: string) =>
		emit({level: "error", message, context: ctx, data}),
};
