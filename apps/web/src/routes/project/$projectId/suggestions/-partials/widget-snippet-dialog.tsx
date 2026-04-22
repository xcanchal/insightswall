import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface WidgetSnippetDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	projectId: string;
}

export const WidgetSnippetDialog = ({ open, onOpenChange, projectId }: WidgetSnippetDialogProps) => {
	const [copied, setCopied] = useState(false);
	const snippet = `<script src="${window.location.origin}/widget.js" data-project="${projectId}"></script>`;

	const handleCopy = async () => {
		await navigator.clipboard.writeText(snippet);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Embed widget</DialogTitle>
					<DialogDescription>Add this snippet to your website to display a feedback button that links to this project.</DialogDescription>
				</DialogHeader>
				<div className="flex flex-col gap-3">
					<pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto whitespace-pre-wrap break-all select-all">
						<code>{snippet}</code>
					</pre>
					<p className="text-xs text-muted-foreground">
						Optional attributes: <code className="bg-muted px-1 rounded">data-label</code> (button text),{' '}
						<code className="bg-muted px-1 rounded">data-color</code> (background color).
					</p>
					<Button onClick={handleCopy} variant="outline" className="self-end">
						{copied ? 'Copied!' : 'Copy snippet'}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
};
