import { HugeiconsIcon } from '@hugeicons/react';
import type { SuggestionCategory } from '@app/types';
import { SparklesIcon } from '@hugeicons/core-free-icons';
import { BugIcon } from '@hugeicons/core-free-icons';

export const SuggestionCategoryPill = ({ category }: { category: SuggestionCategory }) => (
	<span className="flex items-center gap-1 text-xs text-neutral-500 rounded-l-full p-1 w-fit">
		<HugeiconsIcon icon={category === 'FEATURE' ? SparklesIcon : BugIcon} className="size-4" />
	</span>
);
