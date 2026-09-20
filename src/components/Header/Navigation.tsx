/**
 * Main navigation bar.
 *
 * Route set: Home · Search · Cart · Orders · Profile
 * Login / Register are NOT shown here — they are accessible via the
 * auth redirect on /profile and the LoginFormFooter links.
 */
import {NavLink} from "react-router";
import {ShoppingCart, ShieldCheck} from "lucide-react";
import {useLocale} from "../../i18n/LocaleContext";
import {useCart} from "../../hooks/useCart";
import {useAuth} from "../../hooks/useAuth";
import styles from "./Header.module.css";

export function Navigation(): React.ReactElement {
	const {t} = useLocale();
	const {cart} = useCart();
	const {user} = useAuth();

	const cls = ({isActive}: {isActive: boolean}): string => {
		const baseClass = styles.navLink ?? "";
		const activeClass = styles.navLinkActive ?? "";
		return isActive ? `${baseClass} ${activeClass}`.trim() : baseClass;
	};

	return (
		<nav className={styles.nav ?? ""} aria-label={t.nav.mainNav ?? ""}>
			<NavLink to="/" end className={cls}>
				{t.nav.home}
			</NavLink>
			<NavLink to="/search" className={cls}>
				{t.nav.search}
			</NavLink>
			<NavLink to="/cart" className={cls} aria-label={t.cart.heading}>
				<span className={styles.cartLinkContent}>
					<ShoppingCart size={16} aria-hidden="true" />
					{cart && cart.totalItems > 0 && (
						<span className={styles.cartBadge}>{cart.totalItems}</span>
					)}
				</span>
			</NavLink>
			{user && (
				<NavLink to="/orders" className={cls}>
					{t.orders.heading}
				</NavLink>
			)}
			<NavLink to="/profile" className={cls}>
				{t.nav.profile}
			</NavLink>
			{user?.role === "admin" && (
				<NavLink to="/admin/books" className={cls}>
					<span className={styles.cartLinkContent}>
						<ShieldCheck size={16} aria-hidden="true" />
						{t.admin.navLink}
					</span>
				</NavLink>
			)}
		</nav>
	);
}
