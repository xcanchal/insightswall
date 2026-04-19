import { HugeiconsIcon } from '@hugeicons/react';
import type { SuggestionCategory } from '@app/types';
import { SparklesIcon } from '@hugeicons/core-free-icons';
import { BugIcon } from '@hugeicons/core-free-icons';

export const SuggestionCategoryPill = ({ category }: { category: SuggestionCategory }) => {
	// const bgClass = category === 'FEATURE' ? 'bg-green-100' : 'bg-red-100';
	const borderClass = ''; /* `${category === 'FEATURE' ? 'border-green-500' : 'border-red-500'} border` */
	const textClass = 'text-xs text-neutral-500'; /* `${category === 'FEATURE' ? 'text-blue-600' : 'text-amber-500'} text-xs` */

	return (
		<span className={`flex items-center gap-1 ${borderClass} ${textClass} rounded-l-full p-1  w-fit`}>
			<HugeiconsIcon icon={category === 'FEATURE' ? SparklesIcon : BugIcon} className="size-4" />
			<span>{category}</span>
		</span>
	);
};
