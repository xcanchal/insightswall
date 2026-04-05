import { BulbIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';

/* const navLinks = [
	{ to: '/#features', label: 'Features' },
	{ to: '/#pricing', label: 'Pricing' },
]; */

export const ExternalHeader = () => (
	<header className="sticky top-0 bg-white z-10">
		<div className="container mx-auto flex items-center py-4 justify-between px-4 md:px-0">
			<div className="flex items-center gap-12">
				<Link to="/" className="font-bold flex items-center gap-1 font-heading text-lg">
					<HugeiconsIcon icon={BulbIcon} /> Insightswall
				</Link>
				{/* <nav className="flex items-center gap-8">
					{navLinks.map((link) => (
						<a key={link.to} href={link.to} className="text-sm font-semibold hover:text-primary">
							{link.label}
						</a>
					))}
				</nav> */}
			</div>
			<div className="hidden md:flex items-center gap-4">
				<Link to="/auth/login" className="text-sm font-semibold hover:text-primary">
					Log in
				</Link>
				<Link to="/auth/signup">
					<Button>Sign up</Button>
				</Link>
			</div>
		</div>
	</header>
);
