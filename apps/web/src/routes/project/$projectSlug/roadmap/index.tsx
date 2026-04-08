import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/project/$projectSlug/roadmap/')({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/roadmap"!</div>;
}
