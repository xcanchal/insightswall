import { toast } from 'sonner';
import type { SuggestionQueryParams, SuggestionWithVoteContextResponse } from '@/api/suggestions';
import { useDeleteSuggestion, useEditSuggestion, useUpdateSuggestionStatus, useVoteSuggestion } from '@/hooks/use-suggestions';
import { useSession } from '@/lib/auth-client';
import { useState } from 'react';
import { SuggestionStatusPill } from './suggestion-status-pill';
import { ProtectedActionDialog } from '@/components/protected-action-dialog';
import { DeleteSuggestionDialog } from './delete-suggestion-dialog';
import { EditSuggestionStatusDialog } from './edit-suggestion-status-dialog';
import { EditSuggestionDialog } from './edit-suggestion-dialog';
import { SuggestionStatus, type SuggestionCategory } from '@app/types';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { HelpCircleIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { SuggestionCategoryIcon } from './suggestion-category-icon';
import { SuggestionCardActionsMenu } from './suggestion-card-actions-menu';
import { SuggestionCardVote } from './suggestion-card-vote';
import { formatDate } from '@/utils';

interface SuggestionCardProps {
	suggestion: SuggestionWithVoteContextResponse;
	isProjectAdmin: boolean;
	queryParams: SuggestionQueryParams;
}

export const SuggestionCard = ({ suggestion, isProjectAdmin, queryParams }: SuggestionCardProps) => {
	const { mutate: vote, isPending } = useVoteSuggestion(suggestion.projectId, queryParams);
	const { mutate: updateStatus, isPending: isUpdating } = useUpdateSuggestionStatus(suggestion.projectId);
	const { mutate: editSuggestion, isPending: isEditing } = useEditSuggestion(suggestion.projectId);
	const { mutate: deleteSuggestion, isPending: isDeleting } = useDeleteSuggestion(suggestion.projectId);
	const { data: session } = useSession();

	const isOwner = session?.user?.id === suggestion.userId;

	const [protectedActionDialogOpen, setProtectedActionDialogOpen] = useState(false);
	const [editStatusDialogOpen, setEditStatusDialogOpen] = useState(false);
	const [editDialogOpen, setEditDialogOpen] = useState(false);
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

	const handleEdit = (values: { description: string; category: SuggestionCategory }) => {
		editSuggestion(
			{ suggestionId: suggestion.id, ...values },
			{
				onSuccess: () => {
					toast.success('Suggestion updated');
					setEditDialogOpen(false);
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
			<div className="border rounded-xl p-5 flex flex-col gap-2 shadow-lg shadow-foreground/5 bg-background">
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
					<div className="flex flex-col gap-4 flex-1">
						<div className="flex flex-col sm:flex-row gap-8">
							<p className="text-lg flex flex-1 items-start gap-2">
								<SuggestionCategoryIcon category={suggestion.category} />
								<span className="-mt-0.5 text-lg sm:text-xl">{suggestion.description}</span>
							</p>
							<div className="flex items-center justify-between sm:justify-start sm:gap-2">
								<SuggestionCardVote suggestion={suggestion} isPending={isPending} handleVote={handleVote} />
								{(isProjectAdmin || isOwner) && (
									<SuggestionCardActionsMenu
										suggestion={suggestion}
										isProjectAdmin={isProjectAdmin}
										isOwner={isOwner}
										onEditStatus={() => setEditStatusDialogOpen(true)}
										onEdit={() => setEditDialogOpen(true)}
										onDelete={() => setDeleteDialogOpen(true)}
									/>
								)}
							</div>
						</div>
						<div className="flex items-center justify-between gap-3">
							<div className="flex items-center gap-2">
								<SuggestionStatusPill status={suggestion.status} />
								{suggestion.status === 'REJECTED' && suggestion.rejectionReason && (
									<Tooltip>
										<TooltipTrigger asChild>
											<button type="button" className="text-red-700">
												<HugeiconsIcon icon={HelpCircleIcon} className="size-5" />
											</button>
										</TooltipTrigger>
										<TooltipContent>Reason:{suggestion.rejectionReason}</TooltipContent>
									</Tooltip>
								)}
							</div>
							<p className="text-sm text-muted-foreground">Created {formatDate(new Date(suggestion.createdAt))}</p>
						</div>
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

			<EditSuggestionDialog
				open={editDialogOpen}
				onOpenChange={setEditDialogOpen}
				defaultValues={{ description: suggestion.description, category: suggestion.category }}
				onSubmit={handleEdit}
				isUpdating={isEditing}
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
