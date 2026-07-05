import path from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	resolve: {
		alias: {
			'@': path.resolve(import.meta.dirname, './src'),
		},
	},
	test: {
		environment: 'node',
		globals: true,
		include: ['test/integration/**/*.test.ts'],
		exclude: ['dist/**', 'node_modules/**'],
	},
});
