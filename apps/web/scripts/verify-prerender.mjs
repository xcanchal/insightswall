import { readFile } from 'node:fs/promises';

const outputDirectory = new URL('../dist/client/', import.meta.url);

async function readOutput(path) {
	return readFile(new URL(path, outputDirectory), 'utf8');
}

function assertIncludes(html, expected, file) {
	if (!html.includes(expected)) {
		throw new Error(`${file} is missing expected prerendered content: ${expected}`);
	}
}

const [home, about, shell, sitemap] = await Promise.all([
	readOutput('index.html'),
	readOutput('about/index.html'),
	readOutput('_shell.html'),
	readOutput('sitemap.xml'),
]);

assertIncludes(home, '<title>User Feedback Board &amp; Public Roadmap | Insightswall</title>', 'index.html');
assertIncludes(home, '<link rel="canonical" href="https://insightswall.com/"', 'index.html');
assertIncludes(home, 'Turn <span class="text-primary">user feedback</span> into a clear, public roadmap', 'index.html');
assertIncludes(about, '<title>About Insightswall | Simple Product Feedback Software</title>', 'about/index.html');
assertIncludes(about, '<link rel="canonical" href="https://insightswall.com/about"', 'about/index.html');
assertIncludes(about, 'InsightsWall was born from a simple frustration.', 'about/index.html');
assertIncludes(shell, '<title>Insightswall</title>', '_shell.html');
assertIncludes(sitemap, '<loc>https://insightswall.com/</loc>', 'sitemap.xml');
assertIncludes(sitemap, '<loc>https://insightswall.com/about</loc>', 'sitemap.xml');

console.log('Verified prerendered marketing HTML, SPA shell, and sitemap.');
