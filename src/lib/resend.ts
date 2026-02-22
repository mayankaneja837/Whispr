import { Resend } from "resend";

export function getResend() {
	const key = process.env.RESEND_API_KEY;
	if (!key) {
		throw new Error(
			"Missing Resend API key. Set RESEND_API_KEY in the environment before sending emails."
		);
	}
	return new Resend(key);
}
