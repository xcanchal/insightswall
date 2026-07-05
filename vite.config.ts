import tailwindcss from '@tailwindcss/vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { defineConfig } from 'vite';

// Server routes (Hono API) read process.env at request time; in dev they run
// inside the Vite process, so load .env into it. Production gets real env vars.
try {
	process.loadEnvFile(path.resolve(import.meta.dirname, '.env'));
} catch {
	// no .env file (e.g. CI, production image) — env comes from the platform
}

const prerenderedPaths = ['/', '/about'];

export default defineConfig({
	// Auth (better-auth trustedOrigins) is bound to FRONTEND_URL, so the dev
	// server must not silently drift to another port when 5173 is taken.
	server: {
		port: 5173,
		strictPort: true,
	},
	plugins: [
		tanstackStart({
			prerender: {
				enabled: true,
				crawlLinks: false,
				filter: (page) => prerenderedPaths.includes(page.path),
			},
		}),
		react(),
		tailwindcss(),
	],
	resolve: {
		alias: {
			'@': path.resolve(import.meta.dirname, './src'),
		},
	},
});
