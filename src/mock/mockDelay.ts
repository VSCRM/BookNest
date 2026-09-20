import config from "../config";

/** Resolves after the configured mock delay so fake API calls feel realistic. */
export function mockDelay(): Promise<void> {
	return new Promise<void>((resolve) => setTimeout(resolve, config.MOCK_DELAY_MS));
}
