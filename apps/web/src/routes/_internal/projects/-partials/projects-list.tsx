import type { ProjectResponse } from '@/api/projects';
import { ProjectCard } from './project-card';

export interface ProjectsListProps {
	projects: ProjectResponse[];
}

export const ProjectsList = ({ projects }: ProjectsListProps) => {
	return (
		<div className="w-full flex flex-col gap-2">
			{projects.map((project) => (
				<ProjectCard key={project.id} project={project} />
			))}
		</div>
	);
};
