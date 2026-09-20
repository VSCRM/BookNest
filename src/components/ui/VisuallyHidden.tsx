/**
 * Hides content visually while keeping it accessible to screen readers.
 * Use instead of aria-label when you need actual DOM content for assistive tech.
 */
import type {ReactNode} from "react";

export function VisuallyHidden({children}: {children: ReactNode}): React.ReactElement {
	return (
		<span
			style={{
				position: "absolute",
				width: 1,
				height: 1,
				padding: 0,
				margin: -1,
				overflow: "hidden",
				clip: "rect(0,0,0,0)",
				whiteSpace: "nowrap",
				border: 0,
			}}
		>
			{children}
		</span>
	);
}
