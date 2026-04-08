import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Link, Outlet, createRootRouteWithContext } from '@tanstack/react-router';
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

const NotFound = () => (
	<div className="flex flex-col items-center justify-center min-h-screen gap-4">
		<h1 className="text-6xl font-bold">404</h1>
		<p className="text-muted-foreground">This page doesn't exist.</p>
		<Link to="/" className="text-sm font-semibold hover:underline">
			Go to the homepage
		</Link>
	</div>
);

export const Route = createRootRouteWithContext<RouterContext>()({
	component: RootLayout,
	notFoundComponent: NotFound,
});
