import { useDraggable } from '@dnd-kit/core';
import type { SuggestionWithVoteContextResponse } from '@/api/suggestions';
import { SuggestionCategoryPill } from '../../suggestions/-partials/suggestion-category-pill';
import { ThumbsUpIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

interface RoadmapCardProps {
	suggestion: SuggestionWithVoteContextResponse;
	isAdmin: boolean;
}

export const RoadmapCard = ({ suggestion, isAdmin }: RoadmapCardProps) => {
	const { attributes, listeners, setNodeRef, transform } = useDraggable({
		id: suggestion.id,
		data: { suggestion },
		disabled: !isAdmin,
	});

	const style = transform ? { transform: `translate(${transform.x}px, ${transform.y}px)` } : undefined;

	return (
		<div
			ref={setNodeRef}
			style={style}
			{...listeners}
			{...attributes}
			className={`border rounded-lg p-3 bg-background flex flex-col gap-2 shadow-lg ${isAdmin ? 'cursor-grab active:cursor-grabbing' : ''}`}
		>
			<p>{suggestion.description}</p>
			<div className="flex items-center justify-between">
				<SuggestionCategoryPill category={suggestion.category} />
				<div className="flex items-center gap-1 text-muted-foreground">
					<HugeiconsIcon icon={ThumbsUpIcon} className="size-3.5" />
					<span className="text-xs">{suggestion.voteCount}</span>
				</div>
			</div>
		</div>
	);
};
