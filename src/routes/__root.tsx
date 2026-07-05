import { HeadContent, Link, Outlet, Scripts, createRootRouteWithContext } from '@tanstack/react-router';
import type { ReactNode } from 'react';
import { Toaster } from 'sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import type { RouterContext } from '../router';
import appCss from '../index.css?url';

const title = 'Insightswall — Collect feedback, prioritize with votes, share your roadmap';
const description =
	'Public feedback board and roadmap for user-centric software companies. Collect feature requests, let users vote, and communicate progress transparently.';

const umamiWebsiteId = 'db01975d-983d-4029-a070-4dde6a5da7d3';
const analyticsHosts = ['insightswall.com', 'www.insightswall.com'];
const umamiLoader = `
if (${JSON.stringify(analyticsHosts)}.includes(window.location.hostname)) {
	const script = document.createElement('script');
	script.defer = true;
	script.src = 'https://cloud.umami.is/script.js';
	script.dataset.websiteId = '${umamiWebsiteId}';
	document.body.appendChild(script);
}`;

const RootLayout = () => (
	<RootDocument>
		<TooltipProvider>
			<Outlet />
			<Toaster position="bottom-right" />
		</TooltipProvider>
	</RootDocument>
);

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
	return (
		<html lang="en">
			<head>
				<HeadContent />
			</head>
			<body>
				{children}
				<Scripts />
			</body>
		</html>
	);
}

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
			{ charSet: 'UTF-8' },
			{ name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
			{ title },
			{ name: 'description', content: description },

			// Open Graph
			{ property: 'og:type', content: 'website' },
			{ property: 'og:title', content: title },
			{ property: 'og:description', content: description },
			{ property: 'og:url', content: 'https://insightswall.com' },
			{ property: 'og:site_name', content: 'Insightswall' },
			{ property: 'og:image', content: 'https://insightswall.com/og.png' },

			// Twitter
			{ name: 'twitter:card', content: 'summary_large_image' },
			{ name: 'twitter:image', content: 'https://insightswall.com/og.png' },
			{ name: 'twitter:title', content: title },
			{ name: 'twitter:description', content: description },
		],
		links: [
			{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
			{ rel: 'stylesheet', href: appCss },
		],
		scripts: [
			{
				src: 'https://insightswall.com/widget.js',
				'data-project': '3027695c-298f-4a93-896f-d4ff0a11edb2',
			},
			{ children: umamiLoader },
		],
	}),
	component: RootLayout,
	notFoundComponent: NotFound,
});
