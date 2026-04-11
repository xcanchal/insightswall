import type { SuggestionStatus } from '@app/types';

const statusPillMap: Record<SuggestionStatus, { bgClass: string; borderClass: string; textClass: string }> = {
	OPEN: {
		bgClass: 'bg-neutral-100',
		borderClass: '',
		textClass: 'text-neutral-700',
	},
	PLANNED: {
		bgClass: 'bg-green-100',
		borderClass: '',
		textClass: 'text-green-700',
	},
	IN_PROGRESS: {
		bgClass: 'bg-yellow-100',
		borderClass: '',
		textClass: 'text-yellow-700',
	},
	DONE: {
		bgClass: 'bg-green-100',
		borderClass: '',
		textClass: 'text-green-700',
	},
	REJECTED: {
		bgClass: 'bg-red-100',
		borderClass: '',
		textClass: 'text-red-700',
	},
};

export const SuggestionStatusPill = ({ status }: { status: SuggestionStatus }) => {
	return (
		<span
			className={`flex items-center text-xs ${statusPillMap[status].bgClass} ${statusPillMap[status].borderClass} ${statusPillMap[status].textClass} rounded-full py-0.5 px-2 w-fit`}
		>
			<span className="font-semibold">{status}</span>
		</span>
	);
};
