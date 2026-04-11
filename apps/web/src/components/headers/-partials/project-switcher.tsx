import { Link, useNavigate } from '@tanstack/react-router';
import { ArrowDownIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
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
import { ProjectIcon } from '@/components/project-icon';

interface ProjectSwitcherProps {
	currentProject: ProjectResponse;
}

export const ProjectSwitcher = ({ currentProject }: ProjectSwitcherProps) => {
	const { data: projects = [] } = useProjects();
	const navigate = useNavigate();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" size="lg">
					<ProjectIcon url={currentProject.url} sizeClassName="size-5" />
					{currentProject.name} <HugeiconsIcon icon={ArrowDownIcon} className="size-3.5 text-muted-foreground" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-48" align="start">
				<DropdownMenuGroup>
					<DropdownMenuLabel>Projects</DropdownMenuLabel>
					{projects.map((project) => (
						<DropdownMenuCheckboxItem
							key={project.id}
							checked={project.id === currentProject.id}
							onCheckedChange={() => navigate({ to: '/project/$projectId/suggestions', params: { projectId: project.id } })}
						>
							<ProjectIcon url={project.url} sizeClassName="size-4" />
							{project.name}
						</DropdownMenuCheckboxItem>
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
