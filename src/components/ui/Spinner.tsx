/**
 * Atomic loading spinner.
 * Uses a CSS animation so no JS is needed after mount.
 */
interface SpinnerProps {
	size?: number;
	label?: string;
}

export function Spinner({
	size = 24,
	label = "Loading…",
}: SpinnerProps): React.ReactElement {
	return (
		<span
			role="status"
			aria-label={label}
			style={{
				display: "inline-block",
				width: size,
				height: size,
				border: "3px solid var(--color-bg-alt)",
				borderTopColor: "var(--color-accent)",
				borderRadius: "50%",
				animation: "spin 0.8s linear infinite",
				flexShrink: 0,
			}}
		/>
	);
}
