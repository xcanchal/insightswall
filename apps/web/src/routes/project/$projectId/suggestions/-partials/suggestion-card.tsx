import type { SuggestionResponse } from '@/api/suggestions';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import { CogIcon, Message01Icon, PencilIcon, PlusSignIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { SuggestionCategoryPill } from './suggestion-category-pill';
import { SuggestionStatusPill } from './suggestion-status-pill';

interface SuggestionCardProps {
	suggestion: SuggestionResponse;
	isOwner: boolean;
	isProjectAdmin: boolean;
}

export const SuggestionCard = ({ suggestion, isOwner, isProjectAdmin }: SuggestionCardProps) => {
	return (
		<div className="border rounded-xl p-4 flex flex-col gap-2">
			<div className="flex items-center justify-between">
				<div className="flex flex-col gap-4">
					<div className="flex items-center gap-2">
						<SuggestionCategoryPill category={suggestion.category} />
						<SuggestionStatusPill status={suggestion.status} />
					</div>
					<p>{suggestion.description}</p>
				</div>
				<div className="flex items-center gap-2">
					<ButtonGroup>
						<p className="text-sm border px-2 flex items-center justify-center rounded-l-md">{suggestion.votes ?? 120}</p>
						<Button variant="outline" size="icon">
							<HugeiconsIcon icon={PlusSignIcon} />
						</Button>
					</ButtonGroup>
					{isOwner && (
						<Button variant="outline" size="icon">
							<HugeiconsIcon icon={PencilIcon} />
						</Button>
					)}
					{isProjectAdmin && (
						<Button variant="outline" size="icon">
							<HugeiconsIcon icon={CogIcon} />
						</Button>
					)}
					<Button variant="outline" size="icon">
						<HugeiconsIcon icon={Message01Icon} />
					</Button>
				</div>
			</div>
			{/* <p>{suggestion.status}</p> */}
			{/* <p className="text-sm text-muted-foreground">
				Created by {suggestion.userId} on {new Date(suggestion.createdAt).toLocaleDateString()}
			</p> */}
		</div>
	);
};
