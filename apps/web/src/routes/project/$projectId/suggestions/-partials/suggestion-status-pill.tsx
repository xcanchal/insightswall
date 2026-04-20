import type { SuggestionStatus } from '@app/types';

const statusPillMap: Record<SuggestionStatus, { label: string; bgClass: string; borderClass: string; textClass: string }> = {
	OPEN: {
		label: 'OPEN',
		bgClass: 'bg-neutral-200',
		borderClass: '',
		textClass: 'text-neutral-700',
	},
	PLANNED: {
		label: 'PLANNED',
		bgClass: 'bg-blue-100',
		borderClass: 'border-blue-100',
		textClass: 'text-blue-700',
	},
	IN_PROGRESS: {
		label: 'IN PROGRESS',
		bgClass: 'bg-yellow-100',
		borderClass: 'border-yellow-100',
		textClass: 'text-yellow-700',
	},
	DONE: {
		label: 'DONE',
		bgClass: 'bg-green-100',
		borderClass: 'border-green-100',
		textClass: 'text-green-700',
	},
	REJECTED: {
		label: 'REJECTED',
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
			<span>{statusPillMap[status].label}</span>
		</span>
	);
};
