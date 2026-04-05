import { createFileRoute, Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { ArrowRight, DashboardSquare03Icon, SortByUp01Icon, TeachingIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';

const Features = [
	{
		title: 'Collect feedback',
		description: 'Collect feature requests and bug reports from your users',
		icon: <HugeiconsIcon icon={TeachingIcon} className="size-20 md:size-24 text-primary" />,
	},
	{
		title: 'Prioritize feedback',
		description: 'Allow users to vote on suggestions and prioritize them',
		icon: <HugeiconsIcon icon={SortByUp01Icon} className="size-20 md:size-24 text-primary" />,
	},
	{
		title: 'Share your roadmap',
		description: 'Share your roadmap with your users and communicate progress',
		icon: <HugeiconsIcon icon={DashboardSquare03Icon} className="size-20 md:size-24 text-primary" />,
	},
];

export const Route = createFileRoute('/_external/')({
	component: Index,
});

function Index() {
	return (
		<div className="container mx-auto px-4 md:px-0">
			<div className="flex flex-col items-center justify-center gap-8 py-16 md:py-24">
				<h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-center leading-10 md:leading-16 lg:leading-20">
					Listen to your users. <br /> Make the correct decisions
				</h1>
				<Link to="/auth/signup">
					<Button className="h-12 md:h-16 px-8 md:px-10 text-lg md:text-xl rounded-lg md:rounded-xl">
						Get started <HugeiconsIcon icon={ArrowRight} className="size-8" />
					</Button>
				</Link>
				<p>
					Already have an account? <Link to="/auth/login">Log in</Link>
				</p>
			</div>
			<div id="features">
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					{Features.map((feature) => (
						<Card key={feature.title} className="w-full shadow-none flex flex-col gap-4 items-center p-6 lg:p-8">
							{feature.icon}
							<CardTitle className="text-2xl font-bold text-center">{feature.title}</CardTitle>
							<CardDescription className="text-lg text-center">{feature.description}</CardDescription>
						</Card>
					))}
				</div>
			</div>
		</div>
	)
}
