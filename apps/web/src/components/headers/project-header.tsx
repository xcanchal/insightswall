import { ArrowRight, BulbIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';

const navLinks = [
	{ to: '/suggestions', label: 'Suggestions' },
	{ to: '/roadmap', label: 'Roadmap' },
];

const activeProps = { className: 'text-primary' };

export const ProjectHeader = () => (
	<header className="sticky top-0 bg-white shadow-sm z-10">
		<div className="container mx-auto flex items-center py-4 justify-between">
			<div className="flex items-center gap-12">
				<Link to="/" className="font-bold flex items-center gap-1 font-heading text-lg">
					<HugeiconsIcon icon={BulbIcon} /> Insightswall
				</Link>
				<nav className="flex items-center gap-8">
					{navLinks.map((link) => (
						<Link key={link.to} to={link.to} className="text-sm font-semibold hover:text-primary" activeProps={activeProps}>
							{link.label}
						</Link>
					))}
				</nav>
			</div>
			<div className="flex items-center gap-4">
				<Link to="/auth/login" className="text-sm font-semibold hover:text-primary">
					Sign in
				</Link>
				<Link to="/auth/signup">
					<Button size="sm">
						Create account <HugeiconsIcon icon={ArrowRight} />
					</Button>
				</Link>
			</div>
		</div>
	</header>
);
