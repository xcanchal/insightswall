import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/project/$projectId/')({
	beforeLoad: ({ params }) => {
		throw redirect({ to: '/project/$projectId/suggestions', params });
	},
});
