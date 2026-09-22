/**
 * Default cover image shown whenever a book has no `coverImageUrl` — either
 * because an admin created/edited it without picking a cover, or because a
 * cover was explicitly removed.
 *
 * Bundled as a local asset (rather than linking to an external stock photo)
 * so it always loads, matches the site's neutral aesthetic, and doesn't
 * depend on a third-party host staying up. Every place in the UI that
 * renders a book cover should fall back to this single constant so the
 * placeholder is consistent everywhere — the book listing, the book detail
 * page, the cart, etc.
 */
import bookPlaceholderImg from "../assets/book-placeholder.png";

export const BOOK_COVER_PLACEHOLDER = bookPlaceholderImg;
