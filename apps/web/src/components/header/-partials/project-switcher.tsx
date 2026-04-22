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
			<DropdownMenuTrigger asChild className="w-full sm:w-auto">
				<Button variant="outline" size="lg" className="text-lg h-11">
					<ProjectIcon url={currentProject.url} sizeClassName="size-5" />
					{currentProject.name} <HugeiconsIcon icon={ArrowDownIcon} className="size-4" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="sm:min-w-48 sm:max-w-64" align="start">
				<DropdownMenuGroup>
					<DropdownMenuLabel>Projects</DropdownMenuLabel>
					{projects.map((project) => (
						<DropdownMenuCheckboxItem
							key={project.id}
							checked={project.id === currentProject.id}
							onCheckedChange={() => navigate({ to: '/project/$projectId/suggestions', params: { projectId: project.id } })}
							className="text-base"
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
