import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/project/$projectId/roadmap/')({
	component: ProjectRoadmap,
});

function ProjectRoadmap() {
	return <div>Roadmap coming soon</div>;
}
