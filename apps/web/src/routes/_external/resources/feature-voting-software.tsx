import { createFileRoute } from '@tanstack/react-router';
import { ContentLink, ContentPage } from '../-partials/content-page';

export const Route = createFileRoute('/_external/resources/feature-voting-software')({
	component: FeatureVotingSoftware,
});

function FeatureVotingSoftware() {
	return (
		<ContentPage
			eyebrow="Resources"
			title="Feature Voting Software for Better Product Prioritization"
			intro={[
				'Every product team faces the same question:',
				'What should we build next?',
				'Customers ask for different things.',
				'Stakeholders have different priorities.',
				'Resources are limited.',
				'Feature voting helps bring clarity to that decision-making process.',
			]}
			sections={[
				{
					title: 'What is feature voting software?',
					blocks: [
						{
							type: 'paragraph',
							text: 'Feature voting software allows users to vote on feature requests and product ideas.',
						},
						{
							type: 'paragraph',
							text: (
								<>
									Instead of collecting isolated requests, teams can see which suggestions generate the most interest across their user
									base. That signal is strongest when it lives inside a broader{' '}
									<ContentLink href="/resources/customer-feedback-software">customer feedback system</ContentLink>.
								</>
							),
						},
						{
							type: 'paragraph',
							text: 'Voting transforms feedback into a visible demand signal.',
						},
					],
				},
				{
					title: 'Why feature voting matters',
					blocks: [
						{
							type: 'paragraph',
							text: 'Without voting, every request looks equally important.',
						},
						{
							type: 'paragraph',
							text: 'One customer asking loudly for a feature can appear more important than twenty customers quietly wanting something else.',
						},
						{
							type: 'paragraph',
							text: 'Feature voting helps surface patterns.',
						},
						{
							type: 'paragraph',
							text: 'It reveals which requests resonate with the broader community rather than a single individual.',
						},
					],
				},
				{
					title: 'Voting creates visibility',
					blocks: [
						{
							type: 'paragraph',
							text: 'One of the biggest benefits of voting is that users can discover existing requests.',
						},
						{
							type: 'paragraph',
							text: 'Instead of creating duplicate suggestions, they can support ideas already proposed by others.',
						},
						{
							type: 'paragraph',
							text: 'This reduces noise and makes feedback easier to analyze.',
						},
						{
							type: 'paragraph',
							text: 'Over time, a clear picture begins to emerge.',
						},
						{
							type: 'paragraph',
							text: 'Teams can quickly identify:',
						},
						{
							type: 'list',
							items: ['Frequently requested features.', 'Emerging product needs.', 'Popular improvements.', 'Community priorities.'],
						},
					],
				},
				{
					title: 'Voting should not replace product strategy',
					blocks: [
						{
							type: 'paragraph',
							text: 'This is an important distinction.',
						},
						{
							type: 'paragraph',
							text: 'The most voted feature is not automatically the best feature.',
						},
						{
							type: 'paragraph',
							text: 'Product decisions should consider many factors:',
						},
						{
							type: 'list',
							items: ['Customer demand', 'Strategic alignment', 'Technical effort', 'Business goals', 'Long-term vision'],
						},
						{
							type: 'paragraph',
							text: 'Votes provide valuable context, but they are only one input into prioritization.',
						},
						{
							type: 'paragraph',
							text: 'The best teams combine customer signals with product judgment.',
						},
					],
				},
				{
					title: 'Feature voting vs feature prioritization',
					blocks: [
						{
							type: 'paragraph',
							text: 'Feature voting answers:',
						},
						{
							type: 'paragraph',
							text: 'What do users want?',
						},
						{
							type: 'paragraph',
							text: 'Feature prioritization answers:',
						},
						{
							type: 'paragraph',
							text: 'What should we build?',
						},
						{
							type: 'paragraph',
							text: (
								<>
									Voting helps identify demand and decide which ideas may deserve visibility on a{' '}
									<ContentLink href="/resources/public-roadmap-software">public roadmap</ContentLink>.
								</>
							),
						},
						{
							type: 'paragraph',
							text: 'Prioritization helps decide action.',
						},
						{
							type: 'paragraph',
							text: 'Both are important.',
						},
					],
				},
				{
					title: 'Why teams choose InsightsWall',
					blocks: [
						{
							type: 'paragraph',
							text: (
								<>
									InsightsWall combines feature requests, voting, roadmap management, and customer communication in a simple workflow. You
									can also use the <ContentLink href="/alternatives">alternatives hub</ContentLink> when comparing similar tools.
								</>
							),
						},
						{
							type: 'paragraph',
							text: 'Users can submit ideas, vote on requests, discuss improvements, and follow progress as suggestions move into the roadmap.',
						},
						{
							type: 'paragraph',
							text: 'The result is a transparent system that helps both users and product teams stay aligned.',
						},
					],
				},
				{
					title: 'Who is it for?',
					blocks: [
						{
							type: 'paragraph',
							text: 'Feature voting works especially well for:',
						},
						{
							type: 'list',
							items: ['SaaS products', 'Startups', 'Indie projects', 'Open source communities', 'Customer-driven products'],
						},
						{
							type: 'paragraph',
							text: 'Any team that wants to understand demand before making product decisions can benefit from a structured voting process.',
						},
					],
				},
				{
					title: 'Final thoughts',
					blocks: [
						{
							type: 'paragraph',
							text: 'Feature voting gives users a voice.',
						},
						{
							type: 'paragraph',
							text: 'More importantly, it gives teams visibility into customer demand.',
						},
						{
							type: 'paragraph',
							text: 'When combined with thoughtful prioritization, it becomes one of the most effective ways to decide what deserves attention next.',
						},
					],
				},
			]}
			relatedResources={[
				{
					title: 'Customer feedback software',
					description: 'Collect and organize the suggestions that voting helps prioritize.',
					href: '/resources/customer-feedback-software',
				},
				{
					title: 'Public roadmap software',
					description: 'Move prioritized ideas into a public roadmap customers can follow.',
					href: '/resources/public-roadmap-software',
				},
				{
					title: 'Software alternatives',
					description: 'Browse comparison resources for feedback, roadmap, and voting software.',
					href: '/alternatives',
				},
			]}
		/>
	);
}
