const SITE_URL = 'https://insightswall.com';
const DEFAULT_OG_IMAGE = `${SITE_URL}/og.png`;

interface SeoOptions {
	title: string;
	description: string;
	path: string;
}

export function createSeo({ title, description, path }: SeoOptions) {
	const url = new URL(path, SITE_URL).toString();

	return {
		meta: [
			{ title },
			{ name: 'description', content: description },
			{ property: 'og:title', content: title },
			{ property: 'og:description', content: description },
			{ property: 'og:url', content: url },
			{ property: 'og:image', content: DEFAULT_OG_IMAGE },
			{ name: 'twitter:title', content: title },
			{ name: 'twitter:description', content: description },
			{ name: 'twitter:image', content: DEFAULT_OG_IMAGE },
		],
		links: [{ rel: 'canonical', href: url }],
	};
}
