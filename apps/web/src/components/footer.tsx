import { Logo } from '@/components/logo';

const productLinks = [
	{
		title: 'Features',
		href: '/#features',
	},
	{
		title: 'How it works',
		href: '/#how-it-works',
	},
	{
		title: 'Centralize feedback',
		href: '/#scattered-feedback',
	},
	{
		title: 'Use cases',
		href: '/#use-cases',
	},
];

const useCases = [
	{
		title: 'For SaaS companies',
		href: '/#use-cases',
	},
	{
		title: 'For indie makers',
		href: '/#use-cases',
	},
	{
		title: 'For open source projects',
		href: '/#use-cases',
	},
	{
		title: 'For agencies & consultants',
		href: '/#use-cases',
	},
];

const companyLinks = [
	{
		title: 'About',
		href: '/about',
	},
];

const resourcesLinks = [
	{
		title: 'Alternatives',
		href: '/alternatives',
	},
	{
		title: 'Public roadmap software',
		href: '/resources/public-roadmap-software',
	},
	{
		title: 'Customer feedback software',
		href: '/resources/customer-feedback-software',
	},
	{
		title: 'Feature voting software',
		href: '/resources/feature-voting-software',
	},
];

export const Footer = () => {
	return (
		<footer className="border-t border-zinc-200 bg-[#faf9f7]">
			<div className="mx-auto grid max-w-7xl gap-10 px-6 py-8 sm:py-12 md:grid-cols-2 xl:grid-cols-[1.4fr_0.8fr_0.8fr_0.8fr_0.9fr] lg:px-8">
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
							<a key={link.title} href={link.href} className="block text-zinc-600 hover:text-primary">
								{link.title}
							</a>
						))}
					</div>
				</div>

				<div>
					<div className="text-sm font-bold text-zinc-950">Use cases</div>
					<div className="mt-4 space-y-3 text-sm text-zinc-600">
						{useCases.map((link) => (
							<a key={link.title} href={link.href} className="block text-zinc-600 hover:text-primary">
								{link.title}
							</a>
						))}
					</div>
				</div>

				<div>
					<div className="text-sm font-bold text-zinc-950">Resources</div>
					<div className="mt-4 space-y-3 text-sm text-zinc-600">
						{resourcesLinks.map((link) => (
							<a key={link.title} href={link.href} className="block text-zinc-600 hover:text-primary">
								{link.title}
							</a>
						))}
					</div>
				</div>

				<div>
					<div className="text-sm font-bold text-zinc-950">Company</div>
					<div className="mt-4 space-y-3 text-sm text-zinc-600">
						{companyLinks.map((link) => (
							<a key={link.title} href={link.href} className="block text-zinc-600 hover:text-primary">
								{link.title}
							</a>
						))}
					</div>
				</div>
			</div>
		</footer>
	);
};
