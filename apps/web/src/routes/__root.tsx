/* import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { TanStackRouterDevtools } from '@tanstack/router-devtools'; */
import { ClientOnly, HeadContent, Link, Outlet, Scripts, createRootRouteWithContext } from '@tanstack/react-router';
import type { ReactNode } from 'react';
import { Toaster } from 'sonner';
import { AuthSessionSync } from '@/components/auth-session-sync';
import { TooltipProvider } from '@/components/ui/tooltip';
import type { RouterContext } from '../router';
import '../index.css';

const analyticsLoader = `
	if (['insightswall.com', 'www.insightswall.com'].includes(window.location.hostname)) {
		const script = document.createElement('script');
		script.defer = true;
		script.src = 'https://analytics.xaviercanchal.com/script.js';
		script.dataset.websiteId = '2bddffc3-9476-4488-b112-915d25b7292e';
		script.dataset.domains = 'insightswall.com,www.insightswall.com';
		document.body.appendChild(script);
	}
`;

const RootLayout = () => (
	<TooltipProvider>
		<ClientOnly>
			<AuthSessionSync />
		</ClientOnly>
		<Outlet />
		<Toaster position="bottom-right" />
		{/* {import.meta.env.DEV && (
			<>
				<TanStackRouterDevtools />
				<ReactQueryDevtools />
			</>
		)} */}
	</TooltipProvider>
);

const NotFound = () => (
	<div className="flex flex-col flex-1 items-center justify-center gap-4">
		<h1 className="text-6xl font-bold">404</h1>
		<p className="text-muted-foreground">This page doesn&apos;t exist.</p>
		<Link to="/" className="text-sm font-semibold hover:underline">
			Go to the homepage
		</Link>
	</div>
);

export const Route = createRootRouteWithContext<RouterContext>()({
	head: () => ({
		meta: [
			{ charSet: 'utf-8' },
			{ name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
			{ title: 'Insightswall' },
			{
				name: 'description',
				content: 'Collect product feedback, prioritize feature requests with votes, and share a public roadmap.',
			},
			{ property: 'og:type', content: 'website' },
			{ property: 'og:site_name', content: 'Insightswall' },
			{ name: 'twitter:card', content: 'summary_large_image' },
		],
		links: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
	}),
	component: RootComponent,
	notFoundComponent: NotFound,
});

function RootComponent() {
	return (
		<RootDocument>
			<RootLayout />
		</RootDocument>
	);
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
	return (
		<html lang="en">
			<head>
				<HeadContent />
			</head>
			<body>
				{children}
				<script src="https://insightswall.com/widget.js" data-project="3027695c-298f-4a93-896f-d4ff0a11edb2"></script>
				<script dangerouslySetInnerHTML={{ __html: analyticsLoader }}></script>
				<Scripts />
			</body>
		</html>
	);
}
