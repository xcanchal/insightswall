import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Warning } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

export interface DeleteSuggestionDialogProps {
	open: boolean;
	isDeleting: boolean;
	onOpenChange: (open: boolean) => void;
	onConfirmDelete: () => void;
}

export const DeleteSuggestionDialog = ({ open, onOpenChange, onConfirmDelete, isDeleting }: DeleteSuggestionDialogProps) => {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-sm flex flex-col gap-4">
				<h2>Delete suggestion</h2>
				<p className="text-muted-foreground">This suggestion and all its votes will be permanently deleted.</p>
				<p className="bg-red-100 py-2 px-3 flex gap-3 rounded-md">
					<HugeiconsIcon icon={Warning} className="size-6 text-destructive" /> This action cannot be undone.
				</p>
				<div className="flex justify-end gap-2">
					<Button variant="outline" onClick={() => onOpenChange(false)}>
						Cancel
					</Button>
					<Button variant="destructive" onClick={onConfirmDelete} disabled={isDeleting}>
						Yes, delete
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
};
