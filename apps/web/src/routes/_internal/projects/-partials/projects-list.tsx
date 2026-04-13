import type { ProjectResponse } from '@/api/projects';
import { ProjectCard } from './project-card';

export interface ProjectsListProps {
	projects: ProjectResponse[];
}

export const ProjectsList = ({ projects }: ProjectsListProps) => {
	return (
		<div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
			{projects.map((project) => (
				<ProjectCard key={project.id} project={project} />
			))}
		</div>
	);
};
