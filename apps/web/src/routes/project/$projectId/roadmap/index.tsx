import { createFileRoute, useParams } from '@tanstack/react-router';
import { RoadmapBoard } from './-partials/roadmap-board';

export const Route = createFileRoute('/project/$projectId/roadmap/')({
	component: ProjectRoadmap,
});

function ProjectRoadmap() {
	const { projectId } = useParams({ from: '/project/$projectId' });
	return <RoadmapBoard projectId={projectId} />;
}
