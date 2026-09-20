import CryptoJS from "crypto-js";

/**
 * Produces a SHA-256 hex digest of the password.
 * Used as a "network hash" layer: the raw plaintext is never sent over the wire.
 * On the server side bcrypt is applied on top of this digest.
 */
export function hashPassword(password: string): string {
	return CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex);
}
