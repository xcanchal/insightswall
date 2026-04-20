import { createFileRoute, Link, Outlet, useNavigate, useParams } from '@tanstack/react-router';
import { useProjectById } from '@/hooks/use-projects';
import { ProjectIcon } from '@/components/project-icon';
import { Spinner } from '@/components/spinner';
import { ProjectSwitcher } from '@/components/header/-partials/project-switcher';
import { useProjectMemberByProjectId } from '@/hooks/use-project-members';
import { useEffect } from 'react';

export const Route = createFileRoute('/project/$projectId')({
	component: ProjectLayout,
});

const tabClass = 'px-4 py-2 text-sm rounded-md transition-colors';
const activeTabClass = 'bg-background shadow-sm font-medium';

function ProjectLayout() {
	const { projectId } = useParams({ strict: false });
	const { data: project, isLoading } = useProjectById(projectId ?? null);
	const navigate = useNavigate();
	const { data: projectMember } = useProjectMemberByProjectId(projectId ?? null);
	const isAdmin = projectMember?.role === 'ADMIN';

	useEffect(() => {
		if (!isLoading && !project) {
			navigate({ to: '/projects', replace: true });
		}
	}, [isLoading, navigate, project]);

	if (!project) return null;

	return (
		<div className="container mx-auto px-4 sm:px-0 py-6 lg:max-w-4xl">
			<div className="flex w-full flex-col gap-4">
				<div className="flex w-full items-center">
					<div className="flex w-full gap-4 items-center justify-between">
						{isAdmin ? (
							<ProjectSwitcher currentProject={project} />
						) : (
							<div className="flex items-center gap-2">
								<ProjectIcon url={project.url} />
								<h1 className="text-2xl font-semibold">{project.name}</h1>
							</div>
						)}
						<div className="flex items-center gap-1 bg-muted p-1 rounded-lg">
							<Link
								to="/project/$projectId/suggestions"
								params={{ projectId: projectId! }}
								className={tabClass}
								activeProps={{ className: activeTabClass }}
							>
								Suggestions
							</Link>
							<Link
								to="/project/$projectId/roadmap"
								params={{ projectId: projectId! }}
								className={tabClass}
								activeProps={{ className: activeTabClass }}
							>
								Roadmap
							</Link>
						</div>
					</div>
				</div>
				{isLoading ? <Spinner className="size-6 mx-auto" /> : <Outlet />}
			</div>
		</div>
	);
}
