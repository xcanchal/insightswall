import { playwright } from '@vitest/browser-playwright';
import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config';

const browserHeadless = process.env.VITEST_BROWSER_HEADLESS !== 'false';

export default mergeConfig(
	viteConfig,
	defineConfig({
		test: {
			globals: true,
			setupFiles: ['./test/setup.ts'],
			include: ['./src/**/*.test.tsx'],
			css: true,
			browser: {
				enabled: true,
				headless: browserHeadless,
				provider: playwright(),
				instances: [{ browser: 'chromium' }],
			},
		},
	})
);
