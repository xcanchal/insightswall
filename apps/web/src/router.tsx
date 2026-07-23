import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createRouter } from '@tanstack/react-router';
import type { ReactNode } from 'react';
import { routeTree } from './routeTree.gen';

export interface RouterContext {
	queryClient: QueryClient;
	session: { user: unknown; session: unknown } | null;
	isPending: boolean;
}

export function getRouter() {
	const queryClient = new QueryClient();

	return createRouter({
		routeTree,
		context: { queryClient, session: null, isPending: true },
		defaultPreload: 'intent',
		scrollRestoration: true,
		Wrap: ({ children }: { children: ReactNode }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>,
	});
}

declare module '@tanstack/react-router' {
	interface Register {
		router: ReturnType<typeof getRouter>;
	}
}
