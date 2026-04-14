import type { SuggestionStatus } from '@app/types';

const statusPillMap: Record<SuggestionStatus, { bgClass: string; borderClass: string; textClass: string }> = {
	OPEN: {
		bgClass: 'bg-neutral-200',
		borderClass: '',
		textClass: 'text-neutral-700',
	},
	PLANNED: {
		bgClass: 'bg-green-100',
		borderClass: 'border-green-100',
		textClass: 'text-green-700',
	},
	IN_PROGRESS: {
		bgClass: 'bg-yellow-100',
		borderClass: 'border-yellow-100',
		textClass: 'text-yellow-700',
	},
	DONE: {
		bgClass: 'bg-green-100',
		borderClass: 'border-green-100',
		textClass: 'text-green-700',
	},
	REJECTED: {
		bgClass: 'bg-red-100',
		borderClass: 'border-red-100',
		textClass: 'text-red-700',
	},
};

export const SuggestionStatusPill = ({ status }: { status: SuggestionStatus }) => {
	return (
		<span
			className={`flex items-center text-xs ${statusPillMap[status].bgClass} ${statusPillMap[status].borderClass} ${statusPillMap[status].textClass} rounded-md py-1 px-2 w-fit`}
		>
			<span>{status}</span>
		</span>
	);
};
