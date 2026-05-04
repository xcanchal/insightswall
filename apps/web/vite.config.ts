import tailwindcss from '@tailwindcss/vite';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

const umamiWebsiteId = 'db01975d-983d-4029-a070-4dde6a5da7d3';
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
				script.src = 'https://cloud.umami.is/script.js';
				script.dataset.websiteId = '${umamiWebsiteId}';
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
