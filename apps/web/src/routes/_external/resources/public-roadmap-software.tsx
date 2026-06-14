import { createFileRoute } from '@tanstack/react-router';
import { ContentLink, ContentPage } from '../-partials/content-page';

export const Route = createFileRoute('/_external/resources/public-roadmap-software')({
	component: PublicRoadmapSoftware,
});

function PublicRoadmapSoftware() {
	return (
		<ContentPage
			eyebrow="Resources"
			title="Public Roadmap Software for Startups and SaaS Teams"
			intro={[
				'Most product roadmaps live in private tools.',
				"They're hidden inside Notion documents, project boards, spreadsheets, or internal planning systems. While that works for organizing work internally, it leaves customers guessing about what's coming next.",
				'A public roadmap solves that problem.',
				"It gives users visibility into the future of your product and helps them understand what you're working on, what you've already shipped, and where the product is heading.",
			]}
			sections={[
				{
					title: 'What is public roadmap software?',
					blocks: [
						{
							type: 'paragraph',
							text: 'Public roadmap software allows companies to share a customer-facing version of their roadmap.',
						},
						{
							type: 'paragraph',
							text: 'Instead of keeping product plans locked away internally, teams can publish upcoming features, ongoing work, and completed improvements in a format users can easily understand.',
						},
						{
							type: 'paragraph',
							text: "The goal isn't to expose every internal decision.",
						},
						{
							type: 'paragraph',
							text: 'The goal is to improve communication.',
						},
					],
				},
				{
					title: 'Why make your roadmap public?',
					blocks: [
						{
							type: 'paragraph',
							text: 'Customers invest time and money into your product.',
						},
						{
							type: 'paragraph',
							text: 'Naturally, they want to know whether the features they care about are being considered and whether the product is actively evolving.',
						},
						{
							type: 'paragraph',
							text: 'A public roadmap helps:',
						},
						{
							type: 'list',
							items: [
								'Build trust through transparency.',
								'Reduce repeated support questions.',
								'Show customers that feedback matters.',
								'Demonstrate product momentum.',
								'Keep users engaged between releases.',
							],
						},
						{
							type: 'paragraph',
							text: 'For startups especially, a public roadmap can become a competitive advantage.',
						},
						{
							type: 'paragraph',
							text: 'Users are often willing to accept missing features if they can clearly see progress.',
						},
					],
				},
				{
					title: 'Internal roadmap vs public roadmap',
					blocks: [
						{
							type: 'paragraph',
							text: 'An internal roadmap exists for planning.',
						},
						{
							type: 'paragraph',
							text: 'It contains priorities, technical details, dependencies, deadlines, estimates, and discussions.',
						},
						{
							type: 'paragraph',
							text: 'A public roadmap exists for communication.',
						},
						{
							type: 'paragraph',
							text: 'It should be simpler, easier to understand, and focused on what users actually care about.',
						},
						{
							type: 'paragraph',
							text: "Customers don't need to see every internal discussion. They want visibility into where the product is going.",
						},
					],
				},
				{
					title: 'Public roadmaps create better feedback loops',
					blocks: [
						{
							type: 'paragraph',
							text: (
								<>
									One of the biggest benefits of a public roadmap is that it connects{' '}
									<ContentLink href="/resources/customer-feedback-software">customer feedback</ContentLink> with product decisions.
								</>
							),
						},
						{
							type: 'paragraph',
							text: (
								<>
									Users can submit ideas, support requests through{' '}
									<ContentLink href="/resources/feature-voting-software">feature voting</ContentLink>, and see how those requests influence
									future work.
								</>
							),
						},
						{
							type: 'paragraph',
							text: "When people can see that feedback leads somewhere, they're more likely to stay engaged and continue contributing.",
						},
					],
				},
				{
					title: 'Why teams choose InsightsWall',
					blocks: [
						{
							type: 'paragraph',
							text: 'InsightsWall was built around a simple idea:',
						},
						{
							type: 'paragraph',
							text: 'Product communication should be easy.',
						},
						{
							type: 'paragraph',
							text: 'Instead of managing complex product management workflows, teams can focus on sharing progress and keeping users informed.',
						},
						{
							type: 'paragraph',
							text: 'With InsightsWall you can:',
						},
						{
							type: 'list',
							items: [
								'Publish a public roadmap.',
								'Link roadmap items to user suggestions.',
								'Show planned, in-progress, and completed work.',
								'Create a transparent feedback loop.',
								'Keep customers updated without extra effort.',
							],
						},
					],
				},
				{
					title: 'Who is it for?',
					blocks: [
						{
							type: 'paragraph',
							text: 'InsightsWall is ideal for:',
						},
						{
							type: 'list',
							items: ['Indie hackers', 'Solo founders', 'Bootstrapped startups', 'SaaS companies', 'Open source projects'],
						},
						{
							type: 'paragraph',
							text: "If you're looking for a simple way to communicate product direction without adopting enterprise software, a public roadmap may be exactly what your users need.",
						},
					],
				},
				{
					title: 'Final thoughts',
					blocks: [
						{
							type: 'paragraph',
							text: 'A public roadmap is more than a list of upcoming features.',
						},
						{
							type: 'paragraph',
							text: "It's a communication tool.",
						},
						{
							type: 'paragraph',
							text: 'It helps customers understand your priorities, builds confidence in your product, and turns feedback into visible progress.',
						},
					],
				},
			]}
			relatedResources={[
				{
					title: 'Customer feedback software',
					description: 'Organize user ideas and product requests before they become roadmap decisions.',
					href: '/resources/customer-feedback-software',
				},
				{
					title: 'Feature voting software',
					description: 'Use votes as one signal when deciding which feedback should move forward.',
					href: '/resources/feature-voting-software',
				},
				{
					title: 'Software alternatives',
					description: 'Compare feedback board, roadmap, and voting tools from one resource hub.',
					href: '/alternatives',
				},
			]}
		/>
	);
}
