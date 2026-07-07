import { useState } from 'react';
import { toast } from 'sonner';
import type { ProjectResponse } from '@/api/projects';
import { useUpdateProject } from '@/hooks/use-projects';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

interface RoadmapVisibilityToggleProps {
	project: ProjectResponse;
	isAdmin: boolean;
}

type CheckedState = boolean | 'indeterminate';

export const RoadmapVisibilityToggle = ({ project, isAdmin }: RoadmapVisibilityToggleProps) => {
	const [publishDialogOpen, setPublishDialogOpen] = useState(false);
	const { mutate, isPending } = useUpdateProject();

	if (!isAdmin) return null;

	const updateVisibility = (isRoadmapPublic: boolean) => {
		mutate(
			{ projectId: project.id, data: { name: project.name, url: project.url, isRoadmapPublic } },
			{
				onSuccess: () => {
					toast.success(isRoadmapPublic ? 'Roadmap published' : 'Roadmap made private');
					setPublishDialogOpen(false);
				},
				onError: (error) => toast.error(error.message),
			}
		);
	};

	const handleCheckedChange = (checked: CheckedState) => {
		if (checked === true) {
			setPublishDialogOpen(true);
			return;
		}

		updateVisibility(false);
	};

	return (
		<div className="flex flex-col gap-3 rounded-lg border bg-background p-4 sm:flex-row sm:items-center sm:justify-between">
			<div className="flex items-center gap-3">
				<Checkbox id="roadmap-public" checked={project.isRoadmapPublic} disabled={isPending} onCheckedChange={handleCheckedChange} />
				<div className="flex flex-col gap-1">
					<Label htmlFor="roadmap-public">Public roadmap</Label>
					<p className="text-sm leading-5 text-muted-foreground">
						{project.isRoadmapPublic ? 'Anyone can view roadmap items.' : 'Only project members can view roadmap items.'}
					</p>
				</div>
			</div>

			<Dialog open={publishDialogOpen} onOpenChange={setPublishDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Publish roadmap?</DialogTitle>
						<DialogDescription>
							Anyone with the project link will be able to view suggestions marked as Planned, In Progress, or Done.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button type="button" variant="outline" disabled={isPending} onClick={() => setPublishDialogOpen(false)}>
							Cancel
						</Button>
						<Button type="button" disabled={isPending} onClick={() => updateVisibility(true)}>
							Publish roadmap
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
};
