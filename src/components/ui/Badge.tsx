/**
 * Atomic genre badge.
 * Pure presentational — no logic, no side-effects.
 *
 * This is the single canonical genre-badge style, shared by BookCard and
 * BookDetailPage so genre labels look identical everywhere (they used to be
 * three separate, slightly different styles defined in three places).
 */
interface BadgeProps {
	label: string;
}

export function Badge({label}: BadgeProps): React.ReactElement {
	return (
		<span
			style={{
				display: "inline-flex",
				alignItems: "center",
				flexShrink: 0,
				whiteSpace: "nowrap",
				background: "var(--color-dark)",
				color: "var(--color-bg)",
				padding: "4px 10px",
				lineHeight: 1.2,
				fontFamily: "var(--font-mono)",
				fontSize: 11,
				textTransform: "uppercase",
				letterSpacing: "0.5px",
			}}
		>
			{label}
		</span>
	);
}
