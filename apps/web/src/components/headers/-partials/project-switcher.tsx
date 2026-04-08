import { Link, useNavigate } from '@tanstack/react-router';
import { ArrowDownIcon, Checkmark } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useProjects } from '@/hooks/use-projects';
import type { ProjectResponse } from '@/api/projects';
import { Button } from '@/components/ui/button';

interface ProjectSwitcherProps {
	currentProject: ProjectResponse;
}

export const ProjectSwitcher = ({ currentProject }: ProjectSwitcherProps) => {
	const { data: projects = [] } = useProjects();
	const navigate = useNavigate();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline">
					{currentProject.name} <HugeiconsIcon icon={ArrowDownIcon} className="size-3.5 text-muted-foreground" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-48" align="start">
				<DropdownMenuGroup>
					<DropdownMenuLabel>Projects</DropdownMenuLabel>
					{projects.map((project) => (
						<DropdownMenuItem
							key={project.slug}
							onSelect={() => navigate({ to: '/project/$projectSlug/suggestions', params: { projectSlug: project.slug } })}
						>
							{project.slug === currentProject.slug && <HugeiconsIcon icon={Checkmark} />}
							{project.name}
						</DropdownMenuItem>
					))}
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem asChild>
						<Link to="/projects" className="flex items-center gap-2">
							Back to projects
						</Link>
					</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
