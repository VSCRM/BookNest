/** Displays a server-side or auth error banner above the form. */
interface FormErrorProps {
	message?: string;
}

export function FormError({message}: FormErrorProps): React.ReactElement | null {
	if (!message) return null;
	return (
		<div className="form-error" role="alert">
			{message}
		</div>
	);
}
