import { useDroppable } from '@dnd-kit/core';
import type { SuggestionStatus } from '@app/types';
import type { SuggestionWithVoteContextResponse } from '@/api/suggestions';
import { RoadmapCard } from './roadmap-card';

interface RoadmapColumnProps {
	status: SuggestionStatus;
	suggestions: SuggestionWithVoteContextResponse[];
	isAdmin: boolean;
}

const columnConfig: Record<string, { label: string; headerClass: string }> = {
	PLANNED: { label: 'PLANNED', headerClass: 'bg-blue-100 text-blue-700' },
	IN_PROGRESS: { label: 'IN PROGRESS', headerClass: 'bg-yellow-100 text-yellow-700' },
	DONE: { label: 'DONE', headerClass: 'bg-green-100 text-green-700' },
};

export const RoadmapColumn = ({ status, suggestions, isAdmin }: RoadmapColumnProps) => {
	const { setNodeRef, isOver } = useDroppable({ id: status });
	const config = columnConfig[status] ?? { label: status, headerClass: 'bg-neutral-100 text-neutral-700' };

	return (
		<div ref={setNodeRef} className={`flex flex-col rounded-xl bg-neutral-50 min-h-48 ${isOver ? 'ring-3 ring-black/15' : ''}`}>
			<div className={`flex items-center gap-2 px-4 py-3 rounded-lg m-2 ${config.headerClass}`}>
				<span className="text-sm">{config.label}</span>
				<span className="text-xs rounded-full bg-white/50 px-2 py-0.5">{suggestions.length}</span>
			</div>
			<div className="flex flex-col gap-2 p-3 pt-1 flex-1">
				{suggestions.length === 0 ? (
					<p className="text-sm text-muted-foreground text-center py-6">No items</p>
				) : (
					suggestions.map((s) => <RoadmapCard key={s.id} suggestion={s} isAdmin={isAdmin} />)
				)}
			</div>
		</div>
	);
};
