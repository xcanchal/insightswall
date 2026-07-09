import tailwindcss from '@tailwindcss/vite';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

const umamiWebsiteId = '2bddffc3-9476-4488-b112-915d25b7292e';
const analyticsHosts = ['insightswall.com', 'www.insightswall.com'];

export default defineConfig({
	plugins: [
		tanstackRouter({
			target: 'react',
			autoCodeSplitting: true,
		}),
		react(),
		tailwindcss(),
		{
			name: 'inject-umami',
			transformIndexHtml(html) {
				const analyticsLoader = `
		<script>
			if (${JSON.stringify(analyticsHosts)}.includes(window.location.hostname)) {
				const script = document.createElement('script');
				script.defer = true;
				script.src = 'https://analytics.xaviercanchal.com/script.js';
				script.dataset.websiteId = '${umamiWebsiteId}';
				script.dataset.domains = '${analyticsHosts.join(',')}';
				document.body.appendChild(script);
			}
		</script>`;

				return html.replace('</body>', `${analyticsLoader}\n\t</body>`);
			},
		},
	],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
});
