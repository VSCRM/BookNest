import {Loader2} from "lucide-react";

interface SubmitButtonProps {
	loading: boolean;
	disabled?: boolean;
	label: string;
	loadingLabel?: string;
}

/** Primary submit button with loading state. */
export function SubmitButton({
	loading,
	disabled = false,
	label,
	loadingLabel = "Loading…",
}: SubmitButtonProps): React.ReactElement {
	return (
		<button
			type="submit"
			className="btn btn--primary btn--full"
			disabled={disabled || loading}
			aria-busy={loading}
			style={{marginTop: 8}}
		>
			{loading ? (
				<>
					<Loader2
						size={18}
						style={{animation: "spin 1s linear infinite"}}
						aria-hidden="true"
					/>
					{loadingLabel}
				</>
			) : (
				label
			)}
		</button>
	);
}
