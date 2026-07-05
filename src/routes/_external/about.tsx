import { createFileRoute } from '@tanstack/react-router';

const paragraphs = [
	'InsightsWall was born from a simple frustration.',
	'As an independent developer building products on the side, I constantly needed a place to collect feature requests, understand what users wanted, and communicate what I was working on next.',
	'The existing solutions were powerful, but often felt designed for larger organizations with dedicated product teams, complex workflows, and countless configuration options.',
	"Most of the time, I didn't need all of that.",
	'I just wanted a simple feedback board, a public roadmap, and a way to keep users informed.',
	'So I built InsightsWall.',
	'The goal is straightforward: help software teams collect feedback, prioritize ideas, and share their roadmap without adding unnecessary complexity.',
	"Whether you're a solo founder, an indie maker, a startup, or a growing SaaS company, InsightsWall gives you the essential tools to stay connected with your users and build the right things.",
	'No complicated setup. No enterprise jargon. Just a simple place where feedback and product development come together.',
	"Today, InsightsWall is used by founders and product builders who believe that listening to customers shouldn't require a heavyweight product management platform.",
	'Build in public. Listen to your users. Ship what matters.',
];

export const Route = createFileRoute('/_external/about')({
	component: About,
});

function About() {
	return (
		<section className="border-t border-zinc-200 bg-white">
			<div className="mx-auto max-w-3xl px-6 py-16 sm:py-24 lg:px-8">
				<div className="space-y-8">
					<div className="space-y-4">
						<p className="text-sm font-semibold uppercase text-primary">Company</p>
						<h1 className="text-4xl font-black leading-tight text-zinc-950 sm:text-5xl">About InsightsWall</h1>
					</div>

					<div className="space-y-6 text-lg leading-8 text-zinc-700">
						{paragraphs.map((paragraph) => (
							<p key={paragraph}>{paragraph}</p>
						))}
					</div>

					<div className="border-t border-zinc-200 pt-8">
						<p className="text-lg font-semibold text-zinc-950">&mdash; Xavier Canchal</p>
						<p className="mt-1 text-sm text-zinc-600">Founder of InsightsWall</p>
					</div>
				</div>
			</div>
		</section>
	);
}
