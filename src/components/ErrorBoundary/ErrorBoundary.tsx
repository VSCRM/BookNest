/**
 * React class-based error boundary.
 *
 * Class components are still required for error boundaries (React 19 does not
 * yet provide a hook-based alternative).  All other state is kept in functional
 * children.
 *
 * Design
 * ──────
 * • Catches render-phase errors in the entire sub-tree.
 * • Supports a custom `fallback` render prop for full control over the UI.
 * • Provides a `resetKey` prop — changing it clears the error and re-renders
 *   the children (useful when the user navigates to a new route).
 * • Logs errors via the structured `logger` util (suppressed in production).
 */

import {Component, type ReactNode, type ErrorInfo} from "react";
import {logger} from "../../utils/logger";

interface ErrorBoundaryProps {
	children: ReactNode;
	/** Optional custom fallback. Receives the error and a reset callback. */
	fallback?: (error: Error, reset: () => void) => ReactNode;
	/**
	 * Changing this key resets the error boundary.
	 * Typically pass `location.pathname` to reset on navigation.
	 */
	resetKey?: string;
}

interface ErrorBoundaryState {
	hasError: boolean;
	error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
	constructor(props: ErrorBoundaryProps) {
		super(props);
		this.state = {hasError: false, error: null};
	}

	/** Reset when the consumer provides a new `resetKey` (e.g. route change). */
	static getDerivedStateFromProps(
		props: ErrorBoundaryProps,
		state: ErrorBoundaryState & {prevResetKey?: string},
	): Partial<ErrorBoundaryState & {prevResetKey?: string}> | null {
		if (state.hasError && props.resetKey !== state.prevResetKey) {
			return {hasError: false, error: null, prevResetKey: props.resetKey};
		}
		return {prevResetKey: props.resetKey};
	}

	static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
		return {hasError: true, error};
	}

	override componentDidCatch(error: Error, info: ErrorInfo): void {
		logger.error(
			"Uncaught render error",
			{error: error.message, stack: info.componentStack},
			"ErrorBoundary",
		);
	}

	private reset = (): void => {
		this.setState({hasError: false, error: null});
	};

	override render(): ReactNode {
		const {hasError, error} = this.state;
		const {children, fallback} = this.props;

		if (!hasError) return children;

		if (fallback && error) return fallback(error, this.reset);

		return (
			<div
				role="alert"
				style={{
					padding: 32,
					textAlign: "center",
					fontFamily: "var(--font-mono)",
				}}
			>
				<p style={{fontSize: 40, marginBottom: 8}} aria-hidden="true">
					😵
				</p>
				<p
					style={{
						fontFamily: "var(--font-display)",
						fontSize: 24,
						marginBottom: 16,
					}}
				>
					Something went wrong
				</p>
				<p style={{color: "var(--color-gray)", marginBottom: 24, fontSize: 13}}>
					{error?.message ?? "An unexpected error occurred."}
				</p>
				<button className="btn btn--primary" onClick={this.reset}>
					Try again
				</button>
			</div>
		);
	}
}
