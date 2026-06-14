import { createFileRoute } from '@tanstack/react-router';
import { ContentLink, ContentPage } from '../-partials/content-page';

export const Route = createFileRoute('/_external/resources/customer-feedback-software')({
	component: CustomerFeedbackSoftware,
});

function CustomerFeedbackSoftware() {
	return (
		<ContentPage
			eyebrow="Resources"
			title="Customer Feedback Software That Helps You Understand What Users Actually Want"
			intro={[
				'Every product team collects feedback.',
				"The challenge isn't collecting it.",
				'The challenge is organizing it.',
				'Feedback arrives through emails, support tickets, Slack messages, Discord servers, sales calls, customer interviews, and countless other channels.',
				'Eventually it becomes impossible to know which requests are isolated opinions and which represent real demand.',
				"That's where customer feedback software helps.",
			]}
			sections={[
				{
					title: 'What is customer feedback software?',
					blocks: [
						{
							type: 'paragraph',
							text: 'Customer feedback software provides a central place where users can submit ideas, request features, share frustrations, and discuss product improvements.',
						},
						{
							type: 'paragraph',
							text: (
								<>
									Instead of scattering feedback across multiple systems, everything lives in one place and can later inform your{' '}
									<ContentLink href="/resources/public-roadmap-software">public roadmap</ContentLink>.
								</>
							),
						},
						{
							type: 'paragraph',
							text: 'The result is greater visibility, better organization, and better product decisions.',
						},
					],
				},
				{
					title: 'Why feedback becomes difficult to manage',
					blocks: [
						{
							type: 'paragraph',
							text: 'Most teams start small.',
						},
						{
							type: 'paragraph',
							text: "At first, it's easy to remember every request.",
						},
						{
							type: 'paragraph',
							text: 'As the product grows, things change.',
						},
						{
							type: 'paragraph',
							text: 'The same request appears repeatedly across different channels. Important ideas get buried. Customers ask for updates that nobody can easily provide.',
						},
						{
							type: 'paragraph',
							text: 'Eventually the team loses confidence in its understanding of customer needs.',
						},
						{
							type: 'paragraph',
							text: 'Not because feedback is missing.',
						},
						{
							type: 'paragraph',
							text: 'Because there is too much of it.',
						},
					],
				},
				{
					title: "The goal isn't more feedback",
					blocks: [
						{
							type: 'paragraph',
							text: 'Many companies assume feedback software exists to collect more suggestions.',
						},
						{
							type: 'paragraph',
							text: "That's only part of the story.",
						},
						{
							type: 'paragraph',
							text: 'The real value comes from creating clarity.',
						},
						{
							type: 'paragraph',
							text: 'Good feedback systems help teams:',
						},
						{
							type: 'list',
							items: [
								'Identify recurring requests.',
								'Understand customer pain points.',
								'Spot patterns across users.',
								'Reduce duplicate suggestions.',
								'Make decisions based on evidence rather than memory.',
							],
						},
					],
				},
				{
					title: 'Creating a single source of truth',
					blocks: [
						{
							type: 'paragraph',
							text: 'The best feedback systems become the home of product conversations.',
						},
						{
							type: 'paragraph',
							text: 'Instead of searching through old emails or Slack threads, teams can immediately see:',
						},
						{
							type: 'list',
							items: [
								'What users are asking for.',
								'Which ideas are gaining traction.',
								'What discussions are happening.',
								'What decisions have already been made.',
							],
						},
						{
							type: 'paragraph',
							text: (
								<>
									This visibility improves product planning, customer communication, and the way teams evaluate demand through{' '}
									<ContentLink href="/resources/feature-voting-software">feature voting</ContentLink>.
								</>
							),
						},
					],
				},
				{
					title: 'Why small teams need feedback systems too',
					blocks: [
						{
							type: 'paragraph',
							text: 'Feedback management is often associated with larger companies.',
						},
						{
							type: 'paragraph',
							text: 'In reality, startups may benefit even more.',
						},
						{
							type: 'paragraph',
							text: 'When resources are limited, building the wrong feature can be expensive.',
						},
						{
							type: 'paragraph',
							text: 'A structured feedback process helps founders focus on problems that matter most.',
						},
					],
				},
				{
					title: 'Why teams choose InsightsWall',
					blocks: [
						{
							type: 'paragraph',
							text: 'InsightsWall was designed for teams that want feedback management without complexity.',
						},
						{
							type: 'paragraph',
							text: (
								<>
									Users can submit suggestions, vote on ideas, join discussions, and follow product updates from a single place. If
									you&apos;re comparing tools, the <ContentLink href="/alternatives">alternatives hub</ContentLink> is a useful next stop.
								</>
							),
						},
						{
							type: 'paragraph',
							text: 'The goal is simple:',
						},
						{
							type: 'paragraph',
							text: 'Help teams understand customer demand and communicate product decisions more effectively.',
						},
					],
				},
				{
					title: 'Final thoughts',
					blocks: [
						{
							type: 'paragraph',
							text: 'Customer feedback is one of the most valuable sources of product insight available.',
						},
						{
							type: 'paragraph',
							text: 'But insight only appears when feedback is organized.',
						},
						{
							type: 'paragraph',
							text: 'A clear feedback process helps teams spend less time guessing and more time building what users actually need.',
						},
					],
				},
			]}
			relatedResources={[
				{
					title: 'Feature voting software',
					description: 'Turn collected feedback into visible demand signals users and teams can understand.',
					href: '/resources/feature-voting-software',
				},
				{
					title: 'Public roadmap software',
					description: 'Show customers which feedback has moved into planned, in-progress, and shipped work.',
					href: '/resources/public-roadmap-software',
				},
				{
					title: 'Software alternatives',
					description: 'Compare feedback, voting, and roadmap tools from the alternatives hub.',
					href: '/alternatives',
				},
			]}
		/>
	);
}
