import { toast } from 'sonner';
import type { SuggestionQueryParams, SuggestionWithVoteContextResponse } from '@/api/suggestions';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import { useDeleteSuggestion, useUpdateSuggestionStatus, useVoteSuggestion } from '@/hooks/use-suggestions';
import { useSession } from '@/lib/auth-client';
import { Delete02Icon, MoreHorizontalCircle01Icon, PencilEdit01Icon, ThumbsUpIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useState } from 'react';
import { SuggestionCategoryPill } from './suggestion-category-pill';
import { SuggestionStatusPill } from './suggestion-status-pill';
import { ProtectedActionDialog } from '@/components/protected-action-dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { DeleteSuggestionDialog } from './delete-suggestion-dialog';
import { EditSuggestionStatusDialog } from './edit-suggestion-status-dialog';
import { SuggestionStatus } from '@app/types';

interface SuggestionCardProps {
	suggestion: SuggestionWithVoteContextResponse;
	/* isOwner: boolean; TODO: An owner can edit the status of their own suggestion!  */
	isProjectAdmin: boolean;
	queryParams: SuggestionQueryParams;
}

const dateFormatter = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

export const SuggestionCard = ({ suggestion, /* isOwner,  */ isProjectAdmin, queryParams }: SuggestionCardProps) => {
	const { mutate: vote, isPending } = useVoteSuggestion(suggestion.projectId, queryParams);
	const { mutate: updateStatus, isPending: isUpdating } = useUpdateSuggestionStatus(suggestion.projectId);
	const { mutate: deleteSuggestion, isPending: isDeleting } = useDeleteSuggestion(suggestion.projectId);
	const { data: session } = useSession();

	const [protectedActionDialogOpen, setProtectedActionDialogOpen] = useState(false);
	const [editStatusDialogOpen, setEditStatusDialogOpen] = useState(false);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

	const handleVote = () => {
		if (!session?.user) {
			setProtectedActionDialogOpen(true);
			return;
		}
		vote({ suggestionId: suggestion.id, userHasVoted: suggestion.userHasVoted });
	};

	const handleUpdateStatus = (selectedStatus: SuggestionStatus, rejectionReason?: string) => {
		updateStatus(
			{
				suggestionId: suggestion.id,
				status: selectedStatus,
				rejectionReason: selectedStatus === 'REJECTED' ? rejectionReason : undefined,
			},
			{
				onSuccess: () => {
					toast.success('Status updated');
					setEditStatusDialogOpen(false);
				},
				onError: (e) => toast.error(e.message),
			}
		);
	};

	const handleDelete = () => {
		deleteSuggestion(suggestion.id, {
			onSuccess: () => {
				toast.success('Suggestion deleted');
				setDeleteDialogOpen(false);
			},
			onError: (e) => toast.error(e.message),
		});
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
							<p className="text-xs text-muted-foreground ml-1">Created {dateFormatter.format(new Date(suggestion.createdAt))}</p>
						</div>
						{suggestion.status === 'REJECTED' && suggestion.rejectionReason && (
							<p className="text-sm text-muted-foreground italic">Rejected because &quot;{suggestion.rejectionReason}&quot;</p>
						)}
					</div>
					<div className="flex items-center gap-2">
						<ButtonGroup>
							<p className="text-sm border px-2 flex items-center justify-center rounded-l-md min-w-10">{suggestion.voteCount}</p>
							<Button variant={suggestion.userHasVoted ? 'default' : 'outline'} size="icon" disabled={isPending} onClick={handleVote}>
								<HugeiconsIcon icon={ThumbsUpIcon} />
							</Button>
						</ButtonGroup>
						{isProjectAdmin && (
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant="outline" size="icon">
										<HugeiconsIcon icon={MoreHorizontalCircle01Icon} />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end" className="w-44">
									<DropdownMenuItem className="text-base" onSelect={() => setEditStatusDialogOpen(true)}>
										<HugeiconsIcon icon={PencilEdit01Icon} className="size-5" />
										Change status
									</DropdownMenuItem>
									<DropdownMenuItem variant="destructive" className="text-base" onSelect={() => setDeleteDialogOpen(true)}>
										<HugeiconsIcon icon={Delete02Icon} className="size-4" />
										Delete
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						)}
					</div>
				</div>
			</div>

			<EditSuggestionStatusDialog
				open={editStatusDialogOpen}
				onOpenChange={setEditStatusDialogOpen}
				suggestion={suggestion}
				isUpdating={isUpdating}
				confirmUpdateStatus={handleUpdateStatus}
			/>

			<DeleteSuggestionDialog
				open={deleteDialogOpen}
				onOpenChange={setDeleteDialogOpen}
				onConfirmDelete={handleDelete}
				isDeleting={isDeleting}
			/>

			<ProtectedActionDialog
				isOpen={protectedActionDialogOpen}
				onOpenChange={setProtectedActionDialogOpen}
				message="Create a free account or log in to vote on suggestions."
			/>
		</>
	);
};
