import emailjs from "@emailjs/browser";

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

/** True when all three EmailJS credentials are configured in the environment. */
const isConfigured = Boolean(SERVICE_ID && TEMPLATE_ID && PUBLIC_KEY);

export interface SendResetCodeResult {
	/** True when the email was dispatched via EmailJS. */
	sent: boolean;
	/**
	 * The raw reset code returned in dev/preview mode (when EmailJS is not
	 * configured) so the UI can display it on-screen instead of sending email.
	 */
	devCode?: string;
}

/**
 * Sends a six-digit reset code to the given email address via EmailJS.
 * Falls back to a dev-mode response when the EmailJS environment variables are absent.
 */
export async function sendResetCode(
	email: string,
	code: string,
): Promise<SendResetCodeResult> {
	if (!isConfigured) {
		// Dev / preview mode — no real email is sent.
		return {sent: false, devCode: code};
	}

	try {
		await emailjs.send(
			SERVICE_ID as string,
			TEMPLATE_ID as string,
			{to_email: email, reset_code: code},
			PUBLIC_KEY as string,
		);
	} catch (err) {
		// EmailJS is configured but the actual send failed (wrong
		// service/template id, domain not in EmailJS's Allowed Origins,
		// EmailJS quota, network block, etc.) — fall back to the on-screen
		// code instead of leaving the user stuck with no way to reset.
		console.error(
			"[emailService] EmailJS send failed, falling back to on-screen code:",
			err,
		);
		return {sent: false, devCode: code};
	}

	return {
		sent: true,
	};
}
