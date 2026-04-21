import { useDraggable } from '@dnd-kit/core';
import type { SuggestionWithVoteContextResponse } from '@/api/suggestions';
import { SuggestionCategoryIcon } from '../../suggestions/-partials/suggestion-category-icon';
import { ThumbsUpIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { formatDate } from '@/utils';

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
			className={`border rounded-lg p-4 bg-background flex flex-col items-start gap-6 shadow-lg ${isAdmin ? 'cursor-grab active:cursor-grabbing' : ''}`}
		>
			<p className="flex items-start gap-2">
				<SuggestionCategoryIcon category={suggestion.category} />
				<span className="sm:text-lg -mt-0.5">{suggestion.description}</span>
			</p>
			<div className="flex w-full items-center justify-between gap-2">
				<div className="flex items-center gap-1 text-muted-foreground">
					<HugeiconsIcon icon={ThumbsUpIcon} className="size-3.5" />
					<span className="text-xs">{suggestion.voteCount}</span>
				</div>
				<p className="text-xs text-muted-foreground">Updated {suggestion.updatedAt ? formatDate(new Date(suggestion.updatedAt)) : ''}</p>
			</div>
		</div>
	);
};
