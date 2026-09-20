import CryptoJS from "crypto-js";

/** localStorage key for the HMAC signature that binds username ↔ sessionKey. */
const SK_KEY = "bp_sk";
/** sessionStorage key for the per-tab random session key. */
const SIG_KEY = "bp_as";
/** BroadcastChannel name for cross-tab session events. */
const BC_CHANNEL = "bp_auth_bc";

/** Possible message types sent over the BroadcastChannel. */
type SessionMessageType =
	| "SESSION_CREATED"
	| "SESSION_CLEARED"
	| "REQUEST_SESSION_KEY"
	| "SESSION_KEY_RESPONSE";

interface SessionMessage {
	type: SessionMessageType;
	key?: string;
	username?: string;
}

/** Produces a deterministic HMAC-style signature for a username + session-key pair. */
function signSession(username: string, sessionKey: string): string {
	return CryptoJS.SHA256(`${username}:${sessionKey}:booknest-v1`).toString();
}

/**
 * Creates a new browser session for `username`.
 * Stores a random key in sessionStorage and its signed digest in localStorage.
 * Broadcasts the new session key to other open tabs.
 */
export function createSession(username: string): void {
	const sessionKey = crypto.randomUUID();
	sessionStorage.setItem(SK_KEY, sessionKey);
	localStorage.setItem(SIG_KEY, signSession(username, sessionKey));

	try {
		const bc = new BroadcastChannel(BC_CHANNEL);
		const message: SessionMessage = {
			type: "SESSION_CREATED",
			key: sessionKey,
			username,
		};
		bc.postMessage(message);
		bc.close();
	} catch {
		// BroadcastChannel is unavailable in some environments (e.g. private iOS tabs).
	}
}

/**
 * Returns `true` only when sessionStorage contains a session key whose
 * signature matches the one stored in localStorage for `username`.
 */
export function verifySession(username: string): boolean {
	try {
		const sessionKey = sessionStorage.getItem(SK_KEY);
		const storedSig = localStorage.getItem(SIG_KEY);
		if (!sessionKey || !storedSig || !username) return false;
		return signSession(username, sessionKey) === storedSig;
	} catch {
		return false;
	}
}

/**
 * Removes both the session key and the signature.
 * Also broadcasts a SESSION_CLEARED event so other tabs log out immediately.
 */
export function clearSession(): void {
	sessionStorage.removeItem(SK_KEY);
	localStorage.removeItem(SIG_KEY);
	try {
		const bc = new BroadcastChannel(BC_CHANNEL);
		const message: SessionMessage = {type: "SESSION_CLEARED"};
		bc.postMessage(message);
		bc.close();
	} catch {
		// Silently ignore BroadcastChannel failures.
	}
}

/**
 * Subscribes to cross-tab session events.
 *
 * @param onSessionRestored - Called when another tab logs in and shares the session key.
 * @param onSessionCleared  - Called when another tab logs out.
 * @returns A cleanup function that closes the BroadcastChannel.
 */
export function listenForSessionSync(
	onSessionRestored: () => void,
	onSessionCleared: () => void,
): () => void {
	try {
		const bc = new BroadcastChannel(BC_CHANNEL);

		bc.onmessage = (event: MessageEvent<SessionMessage>) => {
			const {type, key, username} = event.data ?? {};

			if (type === "SESSION_CREATED" && key && username) {
				sessionStorage.setItem(SK_KEY, key);
				onSessionRestored();
			}

			if (type === "SESSION_CLEARED") {
				sessionStorage.removeItem(SK_KEY);
				onSessionCleared();
			}

			if (type === "REQUEST_SESSION_KEY") {
				const sk = sessionStorage.getItem(SK_KEY);
				if (sk) {
					const response: SessionMessage = {
						type: "SESSION_KEY_RESPONSE",
						key: sk,
					};
					bc.postMessage(response);
				}
			}

			if (type === "SESSION_KEY_RESPONSE" && key) {
				sessionStorage.setItem(SK_KEY, key);
				onSessionRestored();
			}
		};

		// Ask other tabs for their session key in case this tab has no key yet.
		const sk = sessionStorage.getItem(SK_KEY);
		if (!sk) {
			const request: SessionMessage = {type: "REQUEST_SESSION_KEY"};
			bc.postMessage(request);
		}

		return () => bc.close();
	} catch {
		return () => {
			/* no-op */
		};
	}
}
