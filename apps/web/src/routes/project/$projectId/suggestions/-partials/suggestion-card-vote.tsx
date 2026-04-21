import { ButtonGroup } from '@/components/ui/button-group';
import { Button } from '@/components/ui/button';
import { HugeiconsIcon } from '@hugeicons/react';
import { ThumbsUpIcon } from '@hugeicons/core-free-icons';
import { SuggestionWithVoteContextResponse } from '@/api/suggestions';

export interface SuggestionCardVoteProps {
	suggestion: SuggestionWithVoteContextResponse;
	isPending: boolean;
	handleVote: () => void;
}

export const SuggestionCardVote = ({ suggestion, isPending, handleVote }: SuggestionCardVoteProps) => (
	<ButtonGroup>
		<p className="text-sm border px-2 flex items-center justify-center rounded-l-md min-w-10">{suggestion.voteCount}</p>
		<Button variant={suggestion.userHasVoted ? 'default' : 'outline'} size="icon" disabled={isPending} onClick={handleVote}>
			<HugeiconsIcon icon={ThumbsUpIcon} />
		</Button>
	</ButtonGroup>
);
