import { SuggestionWithVoteContextResponse } from '@/api/suggestions';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Delete02Icon, Exchange01Icon, MoreHorizontalCircle01Icon, PencilEdit02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

export interface SuggestionCardActionsMenuProps {
	suggestion: SuggestionWithVoteContextResponse;
	isProjectAdmin: boolean;
	isOwner: boolean;
	onEditStatus: () => void;
	onEdit: () => void;
	onDelete: () => void;
}

export const SuggestionCardActionsMenu = ({ isProjectAdmin, isOwner, onEditStatus, onEdit, onDelete }: SuggestionCardActionsMenuProps) => {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" size="icon">
					<HugeiconsIcon icon={MoreHorizontalCircle01Icon} />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-44">
				{isProjectAdmin && (
					<DropdownMenuItem className="text-base" onSelect={onEditStatus}>
						<HugeiconsIcon icon={Exchange01Icon} className="size-4" />
						Change status
					</DropdownMenuItem>
				)}
				{isOwner && (
					<DropdownMenuItem className="text-base" onSelect={onEdit}>
						<HugeiconsIcon icon={PencilEdit02Icon} className="size-4" />
						Edit
					</DropdownMenuItem>
				)}
				<DropdownMenuItem variant="destructive" className="text-base" onSelect={onDelete}>
					<HugeiconsIcon icon={Delete02Icon} className="size-4" />
					Delete
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
