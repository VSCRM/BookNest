import {ErrorState} from "../../components/ui/ErrorState";

interface HomeErrorProps {
	message: string;
	onRetry: () => void;
}

export function HomeError({message, onRetry}: HomeErrorProps): React.ReactElement {
	return <ErrorState detail={message} onRetry={onRetry} />;
}
