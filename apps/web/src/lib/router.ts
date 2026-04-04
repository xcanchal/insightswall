import { createRouter } from '@tanstack/react-router';
import type { QueryClient } from '@tanstack/react-query';
import { routeTree } from '../routeTree.gen';

export interface RouterContext {
	queryClient: QueryClient;
}

export const createAppRouter = (queryClient: QueryClient) =>
	createRouter({
		routeTree,
		context: { queryClient },
		defaultPreload: 'intent',
	});

export type AppRouter = ReturnType<typeof createAppRouter>;
