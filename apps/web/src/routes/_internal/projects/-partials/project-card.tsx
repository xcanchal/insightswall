import { Link } from '@tanstack/react-router';
import type { ProjectResponse } from '@/api/projects';
import { Button } from '@/components/ui/button';
import { HugeiconsIcon } from '@hugeicons/react';
import { /* PencilIcon, DeleteIcon, ViewIcon,  */ ArrowRightIcon } from '@hugeicons/core-free-icons';
import { ProjectIcon } from '@/components/project-icon';

export const ProjectCard = ({ project }: { project: ProjectResponse }) => (
	<Link to="/project/$projectId/suggestions" params={{ projectId: project.id }} className="text-foreground">
		<div className="border rounded-lg group cursor-pointer flex items-center justify-between h-20 px-6">
			<div className="flex items-center gap-4">
				<ProjectIcon url={project.url} />
				<h3 className="font-semibold">{project.name}</h3>
			</div>
			<div className="hidden group-hover:flex items-center gap-2">
				<Button variant="ghost" size="icon">
					<HugeiconsIcon icon={ArrowRightIcon} className="size-6" />
				</Button>
				{/* <Button variant="outline" size="icon">
					<HugeiconsIcon icon={ViewIcon} />
				</Button>
				<Button variant="outline" size="icon">
					<HugeiconsIcon icon={PencilIcon} />
				</Button>
				<Button variant="outline" size="icon">
					<HugeiconsIcon icon={DeleteIcon} />
				</Button> */}
			</div>
		</div>
	</Link>
);
