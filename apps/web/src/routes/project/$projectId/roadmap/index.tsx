import { createFileRoute, useParams } from '@tanstack/react-router';
import { useSession } from '@/lib/auth-client';
import { useProjectById } from '@/hooks/use-projects';
import { useProjectMe } from '@/hooks/use-project-members';
import { Spinner } from '@/components/spinner';
import { RoadmapBoard } from './-partials/roadmap-board';
import { PrivateRoadmap } from './-partials/private-roadmap';
import { RoadmapVisibilityToggle } from './-partials/roadmap-visibility-toggle';

export const Route = createFileRoute('/project/$projectId/roadmap/')({
	component: ProjectRoadmap,
});

function ProjectRoadmap() {
	const { projectId } = useParams({ from: '/project/$projectId' });
	const { data: session, isPending: sessionIsPending } = useSession();
	const { data: project, isLoading: projectIsLoading } = useProjectById(projectId);
	const { data: projectMember, isLoading: projectMemberIsLoading } = useProjectMe(projectId);
	const isLoadingAccess = projectIsLoading || sessionIsPending || (!!session?.user && projectMemberIsLoading);

	if (isLoadingAccess) return <Spinner className="size-6 mx-auto py-12" />;
	if (!project) return null;

	const isMember = !!projectMember;
	const isAdmin = projectMember?.role === 'ADMIN';
	const canViewRoadmap = project.isRoadmapPublic || isMember;

	if (!canViewRoadmap) return <PrivateRoadmap />;

	return (
		<div className="flex flex-col gap-3">
			<RoadmapVisibilityToggle project={project} isAdmin={isAdmin} />
			<RoadmapBoard projectId={projectId} isAdmin={isAdmin} />
		</div>
	);
}
