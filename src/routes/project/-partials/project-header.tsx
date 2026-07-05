import { useState } from 'react';
import { ProjectSwitcher } from '@/components/header/-partials/project-switcher';
import { Button } from '@/components/ui/button';
import { CodeIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { WidgetSnippetDialog } from '../$projectId/suggestions/-partials/widget-snippet-dialog';
import { ProjectIcon } from '@/components/project-icon';
import { ProjectResponse } from '@/api/projects';

export interface ProjectHeaderProps {
	project: ProjectResponse;
	isAdmin?: boolean;
}

export const ProjectHeader = ({ project, isAdmin }: ProjectHeaderProps) => {
	const [widgetDialogOpen, setWidgetDialogOpen] = useState(false);

	return isAdmin ? (
		<>
			<div className="flex w-full sm:w-auto items-center gap-2">
				<ProjectSwitcher currentProject={project} />
				<Button variant="outline" onClick={() => setWidgetDialogOpen(true)} className="h-11" size="lg">
					<HugeiconsIcon icon={CodeIcon} className="size-4" /> Embed widget
				</Button>
			</div>
			<WidgetSnippetDialog open={widgetDialogOpen} onOpenChange={setWidgetDialogOpen} projectId={project.id} />
		</>
	) : (
		<div className="flex w-full sm:w-auto items-center gap-2">
			<ProjectIcon url={project.url} />
			<h1 className="text-2xl font-semibold">{project.name}</h1>
		</div>
	);
};
