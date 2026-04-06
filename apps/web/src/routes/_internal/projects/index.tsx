import { createFileRoute } from '@tanstack/react-router';
import { EmptyProjects } from './-partials/empty-projects';

export const Route = createFileRoute('/_internal/projects/')({
	component: UserProjects,
});

function UserProjects() {
	return (
		<div className="container mx-auto">
			<EmptyProjects />
		</div>
	);
}
