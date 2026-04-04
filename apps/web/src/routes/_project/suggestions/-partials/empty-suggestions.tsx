import { Button } from '@/components/ui/button';
import { HugeiconsIcon } from '@hugeicons/react';
import { PlusSignIcon } from '@hugeicons/core-free-icons';

export const EmptySuggestions = () => {
	return (
		<div className="w-full flex flex-col gap-4 items-center justify-center">
			<div className="w-full flex flex-col items-center justify-center p-12 rounded-lg gap-6">
				<div className="flex flex-col items-center justify-center gap-3 text-center">
					<h2>No suggestions</h2>
					<p className="text-muted-foreground leading-7">Found a bug or want to request a feature?</p>
				</div>
				<Button onClick={() => {}} variant="default" size="lg">
					<HugeiconsIcon icon={PlusSignIcon} /> Submit a suggestion
				</Button>
			</div>
		</div>
	);
};
