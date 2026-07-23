import tailwindcss from '@tailwindcss/vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
	server: {
		host: '0.0.0.0',
		port: 5173,
		strictPort: true,
	},
	plugins: [
		tanstackStart({
			spa: {
				enabled: true,
				// Use a non-marketing route so the SPA shell and prerendered
				// homepage can be emitted as separate HTML documents.
				maskPath: '/projects',
			},
			prerender: {
				enabled: false,
				autoStaticPathsDiscovery: false,
				crawlLinks: false,
				failOnError: true,
			},
			pages: [
				{
					path: '/',
					prerender: { enabled: true, crawlLinks: false },
					sitemap: { priority: 1, changefreq: 'weekly' },
				},
				{
					path: '/about',
					prerender: { enabled: true, crawlLinks: false },
					sitemap: { priority: 0.6, changefreq: 'monthly' },
				},
			],
			sitemap: {
				enabled: true,
				host: 'https://insightswall.com',
			},
		}),
		react(),
		tailwindcss(),
	],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
});
