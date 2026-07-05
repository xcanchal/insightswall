import { createFileRoute, Outlet, useMatch, useNavigate, useParams } from '@tanstack/react-router';
import { useProjectById } from '@/hooks/use-projects';
import { Spinner } from '@/components/spinner';
import { useProjectMe } from '@/hooks/use-project-members';
import { useEffect } from 'react';
import { AlertBanner } from '@/components/alert';
import { ApiClientError } from '@/lib/api-client';
import { ProjectHeader } from './-partials/project-header';
import { ProjectSectionToggle } from './-partials/project-section-toggle';

export const Route = createFileRoute('/project/$projectId')({
	component: ProjectLayout,
});

function ProjectLayout() {
	const { projectId } = useParams({ strict: false });
	const { data: project, isLoading, error } = useProjectById(projectId ?? null);
	const navigate = useNavigate();
	const { data: projectMember } = useProjectMe(projectId ?? null);
	const projectErrorStatusCode = error instanceof ApiClientError ? error.statusCode : undefined;

	useEffect(() => {
		if (!isLoading && !project && projectErrorStatusCode === 404) {
			navigate({ to: '/projects', replace: true });
		}
	}, [isLoading, navigate, project, projectErrorStatusCode]);

	const isRoadmap = useMatch({ from: '/project/$projectId/roadmap/', shouldThrow: false });
	const containerClassName = `container mx-auto px-4 sm:px-0 py-4 sm:py-6 ${isRoadmap ? 'lg:max-w-5xl' : 'lg:max-w-4xl'}`;

	if (isLoading) {
		return (
			<div className={containerClassName}>
				<Spinner className="size-6 mx-auto py-12" />
			</div>
		);
	}

	if (error && projectErrorStatusCode !== 404) {
		return (
			<div className={containerClassName}>
				<AlertBanner type="error" message="Failed to load project" />
			</div>
		);
	}

	if (!project) return null;

	return (
		<div className={`${containerClassName} flex min-h-full flex-1 flex-col`}>
			<div className="flex w-full flex-1 flex-col gap-4">
				<div className="flex w-full items-center">
					<div className="flex flex-col sm:flex-row w-full gap-4 items-center justify-between">
						<ProjectHeader project={project} isAdmin={projectMember?.role === 'ADMIN'} />
						<ProjectSectionToggle projectId={project.id} />
					</div>
				</div>
				<div className="flex flex-1 flex-col">
					<Outlet />
				</div>
			</div>
		</div>
	);
}
