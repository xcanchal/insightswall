/* import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { TanStackRouterDevtools } from '@tanstack/router-devtools'; */
import { Link, Outlet, createRootRouteWithContext } from '@tanstack/react-router';
import { Toaster } from 'sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import type { RouterContext } from '../lib/router';

const RootLayout = () => (
	<TooltipProvider>
		<div className="flex flex-col min-h-screen">
			<Outlet />
			<Toaster position="bottom-right" />
			{/* {import.meta.env.DEV && (
			<>
				<TanStackRouterDevtools />
				<ReactQueryDevtools />
			</>
		)} */}
		</div>
	</TooltipProvider>
);

const NotFound = () => (
	<div className="flex flex-col items-center justify-center min-h-screen gap-4">
		<h1 className="text-6xl font-bold">404</h1>
		<p className="text-muted-foreground">This page doesn&apos;t exist.</p>
		<Link to="/" className="text-sm font-semibold hover:underline">
			Go to the homepage
		</Link>
	</div>
);

export const Route = createRootRouteWithContext<RouterContext>()({
	component: RootLayout,
	notFoundComponent: NotFound,
});
