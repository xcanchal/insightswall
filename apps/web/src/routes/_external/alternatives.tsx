import { createFileRoute } from '@tanstack/react-router';
import { ResourceCards } from './-partials/content-page';

const alternativeCards = [
	{
		title: 'Canny alternatives',
		description: 'A comparison guide for teams looking at feedback boards, public roadmaps, and voting workflows.',
	},
];

const resourceCards = [
	{
		title: 'Public roadmap software',
		description: 'Learn how public roadmap software helps startups and SaaS teams communicate product direction.',
		href: '/resources/public-roadmap-software',
	},
	{
		title: 'Customer feedback software',
		description: 'Understand how a central feedback system helps teams organize user ideas and product requests.',
		href: '/resources/customer-feedback-software',
	},
	{
		title: 'Feature voting software',
		description: 'See how voting turns product feedback into a clearer demand signal for prioritization.',
		href: '/resources/feature-voting-software',
	},
];

export const Route = createFileRoute('/_external/alternatives')({
	component: Alternatives,
});

function Alternatives() {
	return (
		<section className="border-t border-zinc-200 bg-white">
			<div className="mx-auto max-w-5xl px-6 py-16 sm:py-24 lg:px-8">
				<div className="max-w-3xl space-y-5">
					<p className="text-sm font-semibold uppercase text-primary">Alternatives</p>
					<h1 className="text-4xl font-black leading-tight text-zinc-950 sm:text-5xl">Feedback and Roadmap Software Alternatives</h1>
					<p className="text-lg leading-8 text-zinc-700">
						Comparison guides for teams choosing customer feedback, feature voting, and public roadmap software.
					</p>
				</div>

				<div className="mt-12 space-y-12">
					<section className="space-y-5">
						<h2 className="text-2xl font-black leading-tight text-zinc-950 sm:text-3xl">Alternative guides</h2>
						<div className="grid gap-4 sm:grid-cols-2">
							{alternativeCards.map((card) => (
								<div key={card.title} className="rounded-lg border border-dashed border-zinc-300 bg-zinc-50 p-5">
									<div className="flex items-center justify-between gap-4">
										<h3 className="text-xl font-bold leading-tight text-zinc-950">{card.title}</h3>
										<span className="shrink-0 rounded-full bg-white px-3 py-1 text-xs font-semibold text-zinc-600">Coming soon</span>
									</div>
									<p className="mt-3 text-sm leading-6 text-zinc-600">{card.description}</p>
								</div>
							))}
						</div>
					</section>

					<section className="space-y-5">
						<h2 className="text-2xl font-black leading-tight text-zinc-950 sm:text-3xl">Resources</h2>
						<ResourceCards cards={resourceCards} />
					</section>
				</div>
			</div>
		</section>
	);
}
