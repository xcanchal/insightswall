import { createFileRoute, Link, Outlet, useMatch, useNavigate, useParams } from '@tanstack/react-router';
import { useState } from 'react';
import { useProjectById } from '@/hooks/use-projects';
import { ProjectIcon } from '@/components/project-icon';
import { Spinner } from '@/components/spinner';
import { ProjectSwitcher } from '@/components/header/-partials/project-switcher';
import { useProjectMe } from '@/hooks/use-project-members';
import { useEffect } from 'react';
import { WidgetSnippetDialog } from './$projectId/suggestions/-partials/widget-snippet-dialog';
import { Button } from '@/components/ui/button';
import { CodeIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { AlertBanner } from '@/components/alert';

export const Route = createFileRoute('/project/$projectId')({
	component: ProjectLayout,
});

const tabClass = 'px-4 py-2 text-sm rounded-md transition-colors flex-1 text-center';
const activeTabClass = 'bg-background shadow-sm font-medium';

function ProjectLayout() {
	const { projectId } = useParams({ strict: false });
	const { data: project, isLoading, error } = useProjectById(projectId ?? null);
	const navigate = useNavigate();
	const { data: projectMember } = useProjectMe(projectId ?? null);
	const isAdmin = projectMember?.role === 'ADMIN';

	useEffect(() => {
		if (!isLoading && !project) {
			navigate({ to: '/projects', replace: true });
		}
	}, [isLoading, navigate, project]);

	const [widgetDialogOpen, setWidgetDialogOpen] = useState(false);
	const isRoadmap = useMatch({ from: '/project/$projectId/roadmap/', shouldThrow: false });

	if (!project) return null;

	return (
		<div className={`container mx-auto px-4 sm:px-0 py-6 ${isRoadmap ? 'lg:max-w-5xl' : 'lg:max-w-4xl'}`}>
			{error ? (
				<AlertBanner type="error" message="Failed to load project" />
			) : (
				<>
					<div className="flex w-full flex-col gap-4">
						<div className="flex w-full items-center">
							<div className="flex flex-col sm:flex-row w-full gap-4 items-center justify-between">
								{isAdmin ? (
									<div className="flex w-full sm:w-auto items-center gap-2">
										<ProjectSwitcher currentProject={project} />
										<Button variant="outline" onClick={() => setWidgetDialogOpen(true)} className="h-11" size="lg">
											<HugeiconsIcon icon={CodeIcon} className="size-4" /> Embed widget
										</Button>
									</div>
								) : (
									<div className="flex w-full sm:w-auto items-center gap-2">
										<ProjectIcon url={project.url} />
										<h1 className="text-2xl font-semibold">{project.name}</h1>
									</div>
								)}
								<div className="flex items-center gap-1 w-full sm:w-auto bg-muted p-1 rounded-lg">
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
					{projectId && <WidgetSnippetDialog open={widgetDialogOpen} onOpenChange={setWidgetDialogOpen} projectId={projectId} />}
				</>
			)}
		</div>
	);
}
