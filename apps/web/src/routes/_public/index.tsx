import { createFileRoute } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { ArrowRight, BulbIcon, NoteIcon, RoadIcon, ThumbsUpIcon, ValidationApprovalIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';

const Features = [
	{
		title: 'Collect feedback',
		description: 'Collect feedback from your users and prioritize it.',
		icon: <HugeiconsIcon icon={ValidationApprovalIcon} className="size-24 text-primary" />,
	},
	{
		title: 'Prioritize feedback',
		description: 'Allow users to vote on suggestions and prioritize them.',
		icon: <HugeiconsIcon icon={ThumbsUpIcon} className="size-24 text-primary" />,
	},
	{
		title: 'Share your roadmap',
		description: 'Share your roadmap with your users and communicate progress.',
		icon: <HugeiconsIcon icon={RoadIcon} className="size-24 text-primary" />,
	},
];

export const Route = createFileRoute('/_public/')({
	component: Index,
});

function Index() {
	return (
		<div className="container mx-auto">
			<div className="flex flex-col items-center justify-center gap-6 py-24">
				<h1 className="text-6xl font-extrabold text-center leading-16">Listen to your users and make the correct decisions</h1>
				<Button className="h-14 px-8 text-xl">
					Get started <HugeiconsIcon icon={ArrowRight} className="size-6" />
				</Button>
			</div>
			<div className="py-12">
				<h2 className="text-3xl font-bold">Features</h2>
				<div className="grid grid-cols-3 gap-4">
					{Features.map((feature) => (
						<Card key={feature.title} className="w-full shadow-none flex flex-col gap-4">
							{feature.icon}
							<CardTitle className="text-2xl font-bold">{feature.title}</CardTitle>
							<CardDescription className="text-lg">{feature.description}</CardDescription>
						</Card>
					))}
				</div>
			</div>
		</div>
	);
}
