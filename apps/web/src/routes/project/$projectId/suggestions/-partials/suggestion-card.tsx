import type { SuggestionQueryParams, SuggestionWithVoteContextResponse } from '@/api/suggestions';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import { useDeleteSuggestion, useUpdateSuggestionStatus, useVoteSuggestion } from '@/hooks/use-suggestions';
import { useSession } from '@/lib/auth-client';
import { Delete02Icon, MoreHorizontalCircle01Icon, PencilEdit01Icon, ThumbsUpIcon, Warning } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useState } from 'react';
import { SuggestionCategoryPill } from './suggestion-category-pill';
import { SuggestionStatusPill } from './suggestion-status-pill';
import { ProtectedActionDialog } from '@/components/protected-action-dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Field, FieldLabel } from '@/components/ui/field';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { SUGGESTION_STATUSES, type SuggestionStatus } from '@app/types';

interface SuggestionCardProps {
	suggestion: SuggestionWithVoteContextResponse;
	/* isOwner: boolean; */
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
	const [editStatusOpen, setEditStatusOpen] = useState(false);
	const [deleteOpen, setDeleteOpen] = useState(false);
	const [selectedStatus, setSelectedStatus] = useState<SuggestionStatus>(suggestion.status);
	const [rejectionReason, setRejectionReason] = useState('');

	const handleVote = () => {
		if (!session?.user) {
			setProtectedActionDialogOpen(true);
			return;
		}
		vote({ suggestionId: suggestion.id, userHasVoted: suggestion.userHasVoted });
	};

	const handleEditStatusOpen = () => {
		setSelectedStatus(suggestion.status);
		setRejectionReason('');
		setEditStatusOpen(true);
	};

	const handleUpdateStatus = () => {
		updateStatus(
			{
				suggestionId: suggestion.id,
				status: selectedStatus,
				rejectionReason: selectedStatus === 'REJECTED' ? rejectionReason : undefined,
			},
			{
				onSuccess: () => {
					toast.success('Status updated');
					setEditStatusOpen(false);
				},
				onError: (e) => toast.error(e.message),
			}
		);
	};

	const handleDelete = () => {
		deleteSuggestion(suggestion.id, {
			onSuccess: () => {
				toast.success('Suggestion deleted');
				setDeleteOpen(false);
			},
			onError: (e) => toast.error(e.message),
		});
	};

	return (
		<>
			<Dialog open={editStatusOpen} onOpenChange={setEditStatusOpen}>
				<DialogContent className="max-w-sm flex flex-col gap-4">
					<h2>Change status</h2>
					<div className="flex flex-col gap-4">
						<Field>
							<FieldLabel>Status</FieldLabel>
							<Select value={selectedStatus} onValueChange={(v) => setSelectedStatus(v as SuggestionStatus)}>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{SUGGESTION_STATUSES.map((s) => (
										<SelectItem key={s} value={s}>
											{s}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</Field>
						{selectedStatus === 'REJECTED' && (
							<Field>
								<FieldLabel>
									Rejection reason <span className="text-muted-foreground">(optional)</span>
								</FieldLabel>
								<Textarea
									value={rejectionReason}
									onChange={(e) => setRejectionReason(e.target.value)}
									placeholder="Explain why this suggestion was rejected..."
									rows={3}
								/>
							</Field>
						)}
					</div>
					<div className="flex justify-end gap-2">
						<Button variant="outline" onClick={() => setEditStatusOpen(false)}>
							Cancel
						</Button>
						<Button onClick={handleUpdateStatus} disabled={isUpdating}>
							Save
						</Button>
					</div>
				</DialogContent>
			</Dialog>

			<Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
				<DialogContent className="max-w-sm flex flex-col gap-4">
					<h2>Delete suggestion</h2>
					<p className="text-muted-foreground">This suggestion and all its votes will be permanently deleted.</p>
					<p className="bg-red-100 py-2 px-3 flex gap-3 rounded-md">
						<HugeiconsIcon icon={Warning} className="size-6 text-destructive" /> This action cannot be undone.
					</p>
					<div className="flex justify-end gap-2">
						<Button variant="outline" onClick={() => setDeleteOpen(false)}>
							Cancel
						</Button>
						<Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
							Yes, delete
						</Button>
					</div>
				</DialogContent>
			</Dialog>

			<div className="border rounded-xl py-4 px-6 flex flex-col gap-2 shadow-lg shadow-foreground/5 bg-background">
				<div className="flex items-center justify-between gap-6">
					<div className="flex flex-col gap-4 flex-1">
						<p className="text-lg">{suggestion.description}</p>
						<div className="flex items-center gap-1">
							<SuggestionCategoryPill category={suggestion.category} />
							<SuggestionStatusPill status={suggestion.status} />
							<p className="text-xs text-muted-foreground ml-1">{dateFormatter.format(new Date(suggestion.createdAt))}</p>
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
									<DropdownMenuItem className="text-base" onSelect={handleEditStatusOpen}>
										<HugeiconsIcon icon={PencilEdit01Icon} className="size-5" />
										Change status
									</DropdownMenuItem>
									<DropdownMenuItem variant="destructive" className="text-base" onSelect={() => setDeleteOpen(true)}>
										<HugeiconsIcon icon={Delete02Icon} className="size-4" />
										Delete
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
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
