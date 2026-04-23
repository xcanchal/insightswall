import { createFileRoute, Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import {
	ArrowRight,
	BriefcaseBusiness,
	CheckCircle,
	GlobeIcon,
	GroupIcon,
	LayoutGrid,
	Message01Icon,
	Search,
	ThumbsUp,
	UserCheck,
	UserRound,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Card, CardContent } from '@/components/ui/card';
import { SuggestionWithVoteContextResponse } from '@/api/suggestions';
import { SuggestionCard } from '../project/$projectId/suggestions/-partials/suggestion-card';
import { RoadmapColumn } from '../project/$projectId/roadmap/-partials/roadmap-column';
import { ProjectIcon } from '@/components/project-icon';

const features = [
	{
		icon: Message01Icon,
		title: 'Collect feature requests and bug reports',
		description: 'Give users one place to submit ideas, report bugs, and discover what others have already suggested',
	},
	{
		icon: ThumbsUp,
		title: 'Use votes to prioritize with more confidence',
		description: 'Turn scattered opinions into visible demand signals so you can see what matters most to your customers',
	},
	{
		icon: LayoutGrid,
		title: 'Promote suggestions to a public roadmap',
		description: 'Move the best ideas into planned, in progress, and done so customers can follow product progress transparently',
	},
	{
		icon: Search,
		title: 'Reduce duplicate requests',
		description: 'Search, filters, categories, and statuses help users find existing feedback before posting the same idea again',
	},
	{
		icon: BriefcaseBusiness,
		title: 'Built for SaaS companies and solopreneurs',
		description: 'A lightweight alternative to heavy product management tools for founders, startups, and growing software teams',
	},
	{
		icon: UserCheck,
		title: 'Keep customers in the loop',
		description: 'Show what is under review, planned, in development, and shipped to build trust and reduce support noise',
	},
];

const steps = [
	{
		number: '01',
		title: 'Create a project',
		description: 'Set up a project board for your product, startup, or SaaS and make it ready for public feedback.',
	},
	{
		number: '02',
		title: 'Collect suggestions',
		description: 'Let users submit feature ideas and bug reports in one structured place instead of scattering feedback across channels.',
	},
	{
		number: '03',
		title: 'Let users vote',
		description: 'Voting surfaces the most requested changes so prioritization becomes faster and more data-informed.',
	},
	{
		number: '04',
		title: 'Publish your roadmap',
		description: 'Promote selected suggestions to roadmap columns so everyone can see what is planned, in progress, and delivered.',
	},
];

const comparison = [
	'Stop tracking product feedback in spreadsheets and random docs',
	'Replace scattered ideas from email, Slack, support chats, and social media',
	'Give customers a dedicated place to vote and follow progress',
	'Communicate roadmap updates publicly without maintaining a separate page by hand',
];

const builtFor = [
	{
		title: 'SaaS companies',
		description: 'Centralize feedback, reduce noise and build what your users actually want.',
		icon: GroupIcon,
	},
	{
		title: 'Indie makers',
		description: 'Validate ideas, ship faster, and grow with your community.',
		icon: UserRound,
	},
	{
		title: 'Open source projects',
		description: 'Let contributors guide the roadmap and improve collaboration.',
		icon: GlobeIcon,
	},

	{
		title: 'Agencies & consultants',
		description: 'Gather client feedback and keep everyone aligned with a shared roadmap.',
		icon: BriefcaseBusiness,
	},
];

const suggestions: SuggestionWithVoteContextResponse[] = [
	{
		id: '1',
		projectId: '1',
		userId: '1',
		description: 'I would like to be able to specify the age of the reader to adapt the difficulty ',
		category: 'FEATURE',
		status: 'PLANNED',
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
		rejectionReason: null,
		voteCount: 5,
		userHasVoted: false,
	},
	{
		id: '2',
		projectId: '1',
		userId: '1',
		description: 'Sometimes the illustrations generation takes too long',
		category: 'BUG',
		status: 'IN_PROGRESS',
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
		rejectionReason: null,
		voteCount: 3,
		userHasVoted: false,
	},
	{
		id: '3',
		projectId: '1',
		userId: '1',
		description: 'I would like to print a physical copy of the storybook and receive it at home',
		category: 'FEATURE',
		status: 'IN_PROGRESS',
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
		rejectionReason: null,
		voteCount: 1,
		userHasVoted: false,
	},
	{
		id: '4',
		projectId: '1',
		userId: '1',
		description: 'I would like to add a new language to the storybook',
		category: 'FEATURE',
		status: 'DONE',
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
		rejectionReason: null,
		voteCount: 0,
		userHasVoted: false,
	},
];

export const Route = createFileRoute('/_external/')({
	component: Index,
});

const sectionContainerClassName = 'container mx-auto max-w-6xl py-12 sm:py-20 px-4 md:px-0';
const sectionHeadingWrapperClassName = 'mx-auto text-center text-balance flex flex-col gap-6';
const sectionCategoryClassName = 'text-sm font-semibold uppercase tracking-tight text-primary';
const sectionHeadingClassName = 'text-3xl font-black tracking-tight leading-tight text-balance sm:text-4xl md:text-5xl';
const sectionSubHeadingClassName = 'text-lg leading-8 text-zinc-600';
const cardHeadingClassName = 'text-xl font-bold tracking-tight';
const cardDescriptionClassName = 'text-sm leading-7 text-zinc-600';

function Index() {
	return (
		<div>
			<section id="hero" className="container mx-auto px-4 md:px-0">
				<div className={`${sectionContainerClassName} px-0!`}>
					<div className="flex flex-col items-center justify-center gap-8">
						<div className="flex flex-col items-center justify-center gap-8 max-w-4xl mx-auto">
							<div className="flex flex-col items-center justify-center gap-2">
								<h1 className="text-balance font-black tracking-tight text-5xl md:text-6xl lg:text-7xl text-center leading-10 md:leading-15 lg:leading-18">
									Turn <span className="text-primary">user feedback</span> into a clear, public roadmap
								</h1>
								<p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-zinc-600 sm:text-xl text-center">
									Insightswall helps companies to collect product feedback, prioritize ideas with votes, and communicate progress through a
									publicly visible roadmap.
								</p>
							</div>
							<div className="flex flex-col items-center justify-center gap-6">
								<Link to="/auth/signup">
									<Button className="h-12 md:h-16 px-8 md:px-10 text-lg md:text-xl rounded-lg md:rounded-xl">
										Get started <HugeiconsIcon icon={ArrowRight} className="size-8" />
									</Button>
								</Link>
								<p className="text-center text-zinc-600">
									Already have an account?{' '}
									<Link to="/auth/login" className="font-semibold">
										Log in
									</Link>
								</p>
							</div>
						</div>

						<Card className="rounded-xl border-zinc-200 bg-zinc-50 flex flex-col gap-6 px-4 py-6 sm:px-6 sm:py-6 mt-8 relative overflow-visible">
							<div className="flex flex-col gap-2">
								<h3 className="flex items-center gap-2">
									<ProjectIcon url="https://unlimitedtales.com" /> UnlimitedTales
								</h3>
								{/* <p className="text-sm text-muted-foreground">UnlimitedTales feedback board</p> */}
							</div>
							<div className="flex flex-col sm:flex-row gap-4 w-full ">
								<Card className="flex flex-2 pt-2 pb-4 px-0 sm:pt-6 sm:pb-8">
									<CardContent className="flex flex-col gap-4 scale-[0.9] -my-11 p-0">
										<h3>Suggestions</h3>
										<div className="flex flex-col gap-2">
											{suggestions.map((suggestion) => (
												<SuggestionCard key={suggestion.id} suggestion={suggestion} isProjectAdmin={false} queryParams={{}} readOnly />
											))}
										</div>
									</CardContent>
								</Card>
								<Card className="flex flex-3 pt-2 pb-4 px-4 sm:pt-3 sm:pb-5 sm:px-0">
									<CardContent className="flex flex-col gap-4 scale-[0.9] -my-8 -mx-4 p-0 h-full flex-1">
										<h3>Roadmap</h3>
										<div className="flex flex-col sm:flex-row gap-1 h-full flex-1">
											<RoadmapColumn
												className="h-full flex-1"
												status="PLANNED"
												suggestions={suggestions.filter((s) => s.status === 'PLANNED')}
												isAdmin={false}
											/>
											<RoadmapColumn
												className="h-full flex-1"
												status="IN_PROGRESS"
												suggestions={suggestions.filter((s) => s.status === 'IN_PROGRESS')}
												isAdmin={false}
											/>
											<RoadmapColumn
												className="h-full flex-1"
												status="DONE"
												suggestions={suggestions.filter((s) => s.status === 'DONE')}
												isAdmin={false}
											/>
										</div>
									</CardContent>
								</Card>
							</div>
							<div className="text-xs absolute right-4 -top-3 text-orange-600 bg-orange-100 rounded-full px-3 py-1 font-semibold">DEMO</div>
						</Card>
					</div>
				</div>
			</section>

			<section id="features" className="border-t border-zinc-200 bg-white">
				<div className={sectionContainerClassName}>
					<div className={sectionHeadingWrapperClassName}>
						<div className={sectionCategoryClassName}>Features</div>
						<h2 className={sectionHeadingClassName}>A centralized place to collect feedback and build a transparent roadmap</h2>
						<p className={sectionSubHeadingClassName}>
							Insightswall is designed to help product teams centralize suggestions, prioritize what matters, and keep users in the loop.
						</p>
					</div>

					<div className="mt-10 sm:mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
						{features.map((feature) => {
							const Icon = feature.icon;
							return (
								<Card key={feature.title} className="rounded-xl border-zinc-200 bg-zinc-50 ">
									<CardContent className="py-4 px-7 flex flex-col gap-4">
										<div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
											<HugeiconsIcon icon={Icon} className="size-8" strokeWidth={2} />
										</div>
										<div className="flex flex-col gap-2">
											<h3 className={cardHeadingClassName}>{feature.title}</h3>
											<p className={cardDescriptionClassName}>{feature.description}</p>
										</div>
									</CardContent>
								</Card>
							);
						})}
					</div>
				</div>
			</section>

			<section id="how-it-works" className="bg-zinc-50 border-t border-zinc-200">
				<div className={sectionContainerClassName}>
					<div className={sectionHeadingWrapperClassName}>
						<div className={sectionCategoryClassName}>How it works</div>
						<h2 className={sectionHeadingClassName}>A simple workflow from project creation to public roadmap</h2>
						<p className={sectionSubHeadingClassName}>
							Create a project, collect suggestions, let users vote, and publish your public roadmap in a few clicks.
						</p>
					</div>
					<div className="mt-10 sm:mt-14 grid gap-4 lg:grid-cols-4">
						{steps.map((step, index) => (
							<Card key={step.number} className="rounded-xl border-zinc-200 bg-white shadow-sm">
								<CardContent className="px-8 pt-4 pb-2 flex flex-col gap-6">
									<div className="text-2xl text-orange-600 font-semibold bg-orange-50 rounded-full w-12 h-12 flex items-center justify-center">
										{index + 1}
									</div>
									<div className="flex flex-col gap-2">
										<h3 className={cardHeadingClassName}>{step.title}</h3>
										<p className={cardDescriptionClassName}>{step.description}</p>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			</section>

			<section id="scattered-feedback" className="border-t border-zinc-200">
				<div className={sectionContainerClassName}>
					<div className={sectionHeadingWrapperClassName}>
						<div className={sectionCategoryClassName}>A solution to scattered feedback</div>
						<h2 className={sectionHeadingClassName}>Stop losing product ideas across email, docs, and random conversations</h2>
						<p className={sectionSubHeadingClassName}>
							Instead of manually collecting feedback in spreadsheets, Notion pages, support threads, or chats, use one dedicated board your
							customers can actually visit, search, vote on, and follow.
						</p>
					</div>

					<div className="mt-12 max-w-3xl mx-auto flex flex-col gap-4">
						{comparison.map((item) => (
							<Card key={item}>
								<CardContent className="flex items-center gap-6">
									<div className="mt-1 rounded-full bg-orange-100 p-1 text-orange-600 w-10 h-10 flex items-center justify-center">
										<HugeiconsIcon icon={CheckCircle} className="size-6" strokeWidth={2} />
									</div>
									<p className="text-lg font-semibold">{item}</p>
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			</section>

			<section id="use-cases" className="bg-zinc-50 border-t border-zinc-200">
				<div className={sectionContainerClassName}>
					<div className={sectionHeadingWrapperClassName}>
						<div className={sectionCategoryClassName}>WHO IS THIS FOR?</div>
						<h2 className={sectionHeadingClassName}>A tool designed for modern software teams that put the users at the center</h2>
						<p className={sectionSubHeadingClassName}>
							Insightswall works well as a feature request tool, customer feedback portal, bug reporting board, and public roadmap page for
							SaaS companies and indie products.
						</p>
					</div>
					<div className="mt-10 sm:mt-14 grid gap-4 lg:grid-cols-2 max-w-4xl mx-auto">
						{builtFor.map((item) => (
							<Card key={item.title} className="rounded-xl border-zinc-200 bg-white shadow-sm">
								<CardContent className="px-10 py-2 flex flex-col  gap-4">
									<HugeiconsIcon icon={item.icon} className="size-12 text-orange-600" />
									<div className="flex flex-col gap-2">
										<h3 className={cardHeadingClassName}>{item.title}</h3>
										<p className={cardDescriptionClassName}>{item.description}</p>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			</section>

			<section id="get-started" className="border-t border-zinc-200">
				<div className={sectionContainerClassName}>
					<div className="bg-primary p-12 sm:p-16 rounded-xl flex flex-col sm:flex-row justify-between items-center gap-8 sm:gap-28">
						<div className="flex flex-col gap-4">
							<h2 className={`${sectionHeadingClassName} text-white`}>Start collecting feedback today</h2>
							<p className="text-white/80 text-lg">
								Create your project board in a couple minutes and start building a better product with your users.
							</p>
						</div>
						<Link to="/auth/signup">
							<Button
								size="lg"
								variant="outline"
								className="h-12 md:h-16 px-8 md:px-10 text-lg md:text-xl rounded-lg md:rounded-xl w-full sm:w-auto"
							>
								Get started <HugeiconsIcon icon={ArrowRight} className="size-8" />
							</Button>
						</Link>
					</div>
				</div>
			</section>
		</div>
	);
}
