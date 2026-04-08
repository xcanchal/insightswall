import { createFileRoute } from '@tanstack/react-router';
import { EmptySuggestions } from './-partials/empty-suggestions';

export const Route = createFileRoute('/project/$projectSlug/suggestions/')({
	component: ProjectSuggestions,
});

function ProjectSuggestions() {
	return (
		<div className="container mx-auto px-4 sm:px-0 py-8">
			<EmptySuggestions />
		</div>
	);
}
