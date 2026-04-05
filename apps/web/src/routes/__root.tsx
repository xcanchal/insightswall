import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Outlet, createRootRouteWithContext } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { Toaster } from 'sonner';
import type { RouterContext } from '../lib/router';

const RootLayout = () => (
	<div className="flex flex-col min-h-screen">
		<Outlet />
		<Toaster position="bottom-right" />
		{import.meta.env.DEV && (
			<>
				<TanStackRouterDevtools />
				<ReactQueryDevtools />
			</>
		)}
	</div>
);

export const Route = createRootRouteWithContext<RouterContext>()({ component: RootLayout });
