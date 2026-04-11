import { HugeiconsIcon } from '@hugeicons/react';
import { Loading03Icon } from '@hugeicons/core-free-icons';

export interface SpinnerProps {
	className?: string;
	fullPage?: boolean;
}

export const Spinner = ({ className = 'size-4' }: SpinnerProps) => {
	return <HugeiconsIcon icon={Loading03Icon} className={`${className} animate-spin`} />;
};
