import type { SuggestionQueryParams, SuggestionResponse } from '@/api/suggestions';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import { useVoteSuggestion } from '@/hooks/use-suggestions';
import { useSession } from '@/lib/auth-client';
import { /* Message01Icon,  */ MoreHorizontalCircle01Icon, PencilIcon, ThumbsUpIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useState } from 'react';
import { SuggestionCategoryPill } from './suggestion-category-pill';
import { SuggestionStatusPill } from './suggestion-status-pill';
import { ProtectedActionDialog } from '@/components/protected-action-dialog';

interface SuggestionCardProps {
	suggestion: SuggestionResponse;
	isOwner: boolean;
	isProjectAdmin: boolean;
	queryParams: SuggestionQueryParams;
}

const dateFormatter = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

export const SuggestionCard = ({ suggestion, isOwner, isProjectAdmin, queryParams }: SuggestionCardProps) => {
	const { mutate: vote, isPending } = useVoteSuggestion(suggestion.projectId, queryParams);
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
			<div className="border rounded-xl py-4 px-6 flex flex-col gap-2 shadow-lg shadow-foreground/5 bg-background">
				<div className="flex items-center justify-between gap-6">
					<div className="flex flex-col gap-4 flex-1">
						<p className="text-lg">{suggestion.description}</p>
						<div className="flex items-center gap-1">
							<SuggestionCategoryPill category={suggestion.category} />
							<SuggestionStatusPill status={suggestion.status} />
							<p className="text-xs text-muted-foreground ml-1">{dateFormatter.format(new Date(suggestion.createdAt))}</p>
						</div>
					</div>
					<div className="flex items-center gap-2">
						<ButtonGroup>
							<p className="text-sm border px-2 flex items-center justify-center rounded-l-md min-w-10">{suggestion.voteCount}</p>
							<Button variant={suggestion.userHasVoted ? 'default' : 'outline'} size="icon" disabled={isPending} onClick={handleVote}>
								<HugeiconsIcon icon={ThumbsUpIcon} />
							</Button>
						</ButtonGroup>
						{/* <Button variant="outline" size="icon">
							<HugeiconsIcon icon={Message01Icon} />
						</Button> */}
						{isOwner && (
							<Button variant="outline" size="icon">
								<HugeiconsIcon icon={PencilIcon} />
							</Button>
						)}
						{isProjectAdmin && (
							<Button variant="outline" size="icon">
								<HugeiconsIcon icon={MoreHorizontalCircle01Icon} />
							</Button>
						)}
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
