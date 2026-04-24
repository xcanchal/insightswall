import { Alert } from '@/components/ui/alert';
import { AlertCircleIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

export interface AlertBannerProps {
	type?: 'error' | 'warning' | 'info' | 'success' | 'default';
	message: string;
}

export function AlertBanner({ type = 'default', message }: AlertBannerProps) {
	let className = '';

	switch (type) {
		case 'default':
			className = 'bg-neutral-100 text-neutral-700';
			break;
		case 'info':
			className = 'bg-blue-100 text-blue-700';
			break;
		case 'success':
			className = 'bg-green-100 text-green-700';
			break;
		case 'error':
			className = 'bg-red-100 text-red-700';
			break;
		case 'warning':
			className = 'bg-orange-100 text-amber-600';
			break;
	}

	return (
		<Alert className={`${className} border-none`}>
			<HugeiconsIcon icon={AlertCircleIcon} /> {message}
		</Alert>
	);
}
