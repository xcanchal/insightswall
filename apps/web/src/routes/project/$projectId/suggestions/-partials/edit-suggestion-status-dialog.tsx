import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Field, FieldLabel } from '@/components/ui/field';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { SuggestionStatus, SUGGESTION_STATUSES } from '@app/types';
import type { SuggestionWithVoteContextResponse } from '@/api/suggestions';
import { formatSuggestionStatus } from '@/utils';

export interface EditSuggestionStatusDialogProps {
	suggestion: SuggestionWithVoteContextResponse;
	open: boolean;
	isUpdating: boolean;
	onOpenChange: (open: boolean) => void;
	confirmUpdateStatus: (selectedStatus: SuggestionStatus, rejectionReason?: string) => void;
}

export const EditSuggestionStatusDialog = ({
	open,
	suggestion,
	onOpenChange,
	isUpdating,
	confirmUpdateStatus,
}: EditSuggestionStatusDialogProps) => {
	const [selectedStatus, setSelectedStatus] = useState<SuggestionStatus>(suggestion.status);
	const [rejectionReason, setRejectionReason] = useState('');

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
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
								{SUGGESTION_STATUSES.map((status) => (
									<SelectItem key={status} value={status}>
										{formatSuggestionStatus(status)}
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
					<Button variant="outline" onClick={() => onOpenChange(false)}>
						Cancel
					</Button>
					<Button onClick={() => confirmUpdateStatus(selectedStatus, rejectionReason)} disabled={isUpdating}>
						Save
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
};
