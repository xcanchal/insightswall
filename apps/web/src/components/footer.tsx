import { Logo } from '@/components/logo';

const productLinks = [
	{
		title: 'Features',
		anchor: '#features',
	},
	{
		title: 'How it works',
		anchor: '#how-it-works',
	},
	{
		title: 'Centralize feedback',
		anchor: '#scattered-feedback',
	},
	{
		title: 'Use cases',
		anchor: '#use-cases',
	},
];

const useCases = [
	{
		title: 'For SaaS companies',
		anchor: '#use-cases',
	},
	{
		title: 'For indie makers',
		anchor: '#use-cases',
	},
	{
		title: 'For open source projects',
		anchor: '#use-cases',
	},
	{
		title: 'For agencies & consultants',
		anchor: '#use-cases',
	},
];

export const Footer = () => {
	return (
		<footer className="border-t border-zinc-200 bg-[#faf9f7]">
			<div className="mx-auto grid max-w-7xl gap-10 px-6 py-8 sm:py-12 lg:grid-cols-[1.5fr_0.8fr_0.8fr] lg:px-8">
				<div>
					<div className="flex items-center gap-3">
						<Logo />
					</div>
					<p className="mt-4 max-w-sm text-sm leading-7 text-zinc-600">
						Public feedback board and roadmap for user-centric software companies.
					</p>
				</div>

				<div>
					<div className="text-sm font-bold text-zinc-950">Product</div>
					<div className="mt-4 space-y-3 text-sm text-zinc-600">
						{productLinks.map((link) => (
							<a key={link.title} href={link.anchor} className="block hover:text-zinc-950">
								{link.title}
							</a>
						))}
					</div>
				</div>

				<div>
					<div className="text-sm font-bold text-zinc-950">Use cases</div>
					<div className="mt-4 space-y-3 text-sm text-zinc-600">
						{useCases.map((link) => (
							<a key={link.title} href={link.anchor} className="block hover:text-zinc-950">
								{link.title}
							</a>
						))}
					</div>
				</div>
			</div>
		</footer>
	);
};
