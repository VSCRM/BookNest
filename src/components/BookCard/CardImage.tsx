/**
 * Book card hero image.
 *
 * Performance
 * ───────────
 * • `loading="lazy"` — browser-native lazy loading (no JS library needed).
 * • `decoding="async"` — non-blocking image decode.
 * • `aspect-ratio` wrapper prevents layout shift (CLS).
 * • `fetchpriority="high"` would be set on the FIRST visible card, but since
 *   we don't know which card is first here, we rely on the browser's default
 *   heuristic.
 */
import styles from "./BookCard.module.css";

const FALLBACK =
	"https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&auto=format&fit=crop";

interface CardImageProps {
	src?: string;
	alt: string;
	/** Pass true for the first visible card to enable eager loading (LCP opt). */
	priority?: boolean;
}

export function CardImage({
	src,
	alt,
	priority = false,
}: CardImageProps): React.ReactElement {
	return (
		<div className={styles.imageWrap}>
			<img
				src={src ?? FALLBACK}
				alt={alt}
				loading={priority ? "eager" : "lazy"}
				decoding="async"
				onError={(e) => {
					const img = e.currentTarget as HTMLImageElement;
					if (img.src !== FALLBACK) img.src = FALLBACK;
				}}
			/>
		</div>
	);
}
