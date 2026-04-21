import { SuggestionWithVoteContextResponse } from '@/api/suggestions';
import { HugeiconsIcon } from '@hugeicons/react';
import { SparklesIcon } from '@hugeicons/core-free-icons';
import { BugIcon } from '@hugeicons/core-free-icons';

export interface SuggestionCategoryIconProps {
	category: SuggestionWithVoteContextResponse['category'];
}

export const SuggestionCategoryIcon = ({ category }: SuggestionCategoryIconProps) => (
	<span className="bg-neutral-100 rounded-md p-1 text-neutral-700">
		<HugeiconsIcon icon={category === 'FEATURE' ? SparklesIcon : BugIcon} className="size-4" />
	</span>
);
