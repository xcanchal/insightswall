import type { SuggestionResponse } from '@/api/suggestions';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import { useVoteSuggestion } from '@/hooks/use-suggestions';
import { useSession } from '@/lib/auth-client';
import { CogIcon, Message01Icon, PencilIcon, ThumbsUpIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useState } from 'react';
import { SuggestionCategoryPill } from './suggestion-category-pill';
import { SuggestionStatusPill } from './suggestion-status-pill';
import { ProtectedActionDialog } from '@/components/protected-action-dialog';

interface SuggestionCardProps {
	suggestion: SuggestionResponse;
	isOwner: boolean;
	isProjectAdmin: boolean;
}

export const SuggestionCard = ({ suggestion, isOwner, isProjectAdmin }: SuggestionCardProps) => {
	const { mutate: vote, isPending } = useVoteSuggestion(suggestion.projectId);
	const { data: session } = useSession();
	const [protectedActionDialogOpen, setProtectedActionDialogOpen] = useState(false);

	const handleVote = () => {
		if (!session?.user) {
			setProtectedActionDialogOpen(true);
			return;
		}
		vote({ suggestionId: suggestion.id, userHasVoted: suggestion.userHasVoted });
	};

	return (
		<>
			<div className="border rounded-xl p-4 flex flex-col gap-2">
				<div className="flex items-center justify-between">
					<div className="flex flex-col gap-4">
						<p className="text-lg">{suggestion.description}</p>
						<div className="flex items-center gap-2">
							<SuggestionCategoryPill category={suggestion.category} />
							<SuggestionStatusPill status={suggestion.status} />
						</div>
					</div>
					<div className="flex items-center gap-2">
						<ButtonGroup>
							<p className="text-sm border px-2 flex items-center justify-center rounded-l-md min-w-10">{suggestion.voteCount}</p>
							<Button variant={suggestion.userHasVoted ? 'default' : 'outline'} size="icon" disabled={isPending} onClick={handleVote}>
								<HugeiconsIcon icon={ThumbsUpIcon} />
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
			</div>
			<ProtectedActionDialog
				isOpen={protectedActionDialogOpen}
				onOpenChange={setProtectedActionDialogOpen}
				message="Create a free account or log in to vote on suggestions."
			/>
		</>
	);
};
