import {useState} from "react";
import {CloudOff} from "lucide-react";
import {useLocale} from "../../i18n/LocaleContext";
import {Spinner} from "./Spinner";

interface ErrorStateProps {
	/** Raw error message (e.g. from an ApiError) — shown as a small technical detail line. */
	detail?: string;
	/** Re-runs the failed request. May be async; the button shows a spinner while it's pending. */
	onRetry: () => void | Promise<void>;
}

/**
 * Friendly "server didn't respond" state with a retry button — for
 * genuine network/server failures (timeouts, connection refused, 5xx).
 *
 * NOT for expired sessions: a 401 that survives the refresh attempt
 * already triggers a global redirect to /login (see api.ts's
 * `booknest:auth-expired` event), so callers should check
 * `error.isAuthExpired` and skip rendering this entirely in that case —
 * otherwise this flashes on screen for a moment right before the redirect,
 * which is confusing on its own.
 */
export function ErrorState({detail, onRetry}: ErrorStateProps): React.ReactElement {
	const {t} = useLocale();
	const [retrying, setRetrying] = useState(false);

	const handleRetry = async (): Promise<void> => {
		setRetrying(true);
		try {
			await onRetry();
		} finally {
			setRetrying(false);
		}
	};

	return (
		<div
			role="alert"
			style={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				gap: 12,
				padding: "48px 24px",
				textAlign: "center",
			}}
		>
			{/*
			 * Was a 🫠 emoji glyph. Emoji rendering depends on the OS/browser
			 * having a colour-emoji font installed — several environments
			 * (headless browsers, some Linux setups, locked-down corporate
			 * images) don't, and silently fall back to an empty tofu box
			 * instead. An inline lucide SVG always renders the same way and,
			 * unlike the static emoji before it, can actually be animated.
			 */}
			<CloudOff
				size={40}
				aria-hidden="true"
				style={{
					color: "var(--color-gray)",
					animation: "iconFloat 2.4s ease-in-out infinite",
				}}
			/>
			<p style={{fontFamily: "var(--font-display)", fontSize: 20, margin: 0}}>
				{t.common.serverErrorTitle}
			</p>
			<p
				style={{
					color: "var(--color-gray)",
					fontSize: 13,
					maxWidth: 360,
					margin: 0,
				}}
			>
				{t.common.serverErrorBody}
			</p>
			{detail && (
				<p
					style={{
						color: "var(--color-gray)",
						fontSize: 11,
						fontFamily: "var(--font-mono)",
						opacity: 0.7,
						margin: 0,
					}}
				>
					{detail}
				</p>
			)}
			<button
				className="btn btn--primary"
				onClick={() => void handleRetry()}
				disabled={retrying}
			>
				{retrying ? (
					<span style={{display: "inline-flex", alignItems: "center", gap: 8}}>
						<Spinner size={14} label={t.common.retrying} />
						{t.common.retrying}
					</span>
				) : (
					t.common.retry
				)}
			</button>
		</div>
	);
}
