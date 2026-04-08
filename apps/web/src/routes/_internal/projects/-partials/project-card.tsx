import { Link } from '@tanstack/react-router';
import type { ProjectResponse } from '@/api/projects';
import { Button } from '@/components/ui/button';
import { HugeiconsIcon } from '@hugeicons/react';
import { PencilIcon, DeleteIcon, ViewIcon } from '@hugeicons/core-free-icons';

export const ProjectCard = ({ project }: { project: ProjectResponse }) => (
	<Link to="/project/$projectSlug/suggestions" params={{ projectSlug: project.slug }} className="text-foreground">
		<div className="border rounded-lg p-6 group cursor-pointer flex items-center justify-between">
			<div className="flex flex-col gap-2">
				<h3 className="font-semibold">{project.name}</h3>
				<p className="text-sm text-muted-foreground">{project.slug}</p>
			</div>
			<div className="hidden group-hover:flex items-center gap-2">
				<Button variant="outline" size="icon">
					<HugeiconsIcon icon={ViewIcon} />
				</Button>
				<Button variant="outline" size="icon">
					<HugeiconsIcon icon={PencilIcon} />
				</Button>
				<Button variant="outline" size="icon">
					<HugeiconsIcon icon={DeleteIcon} />
				</Button>
			</div>
		</div>
	</Link>
);
