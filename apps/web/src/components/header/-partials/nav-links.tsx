import { Link, useLocation } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { HugeiconsIcon } from '@hugeicons/react';
import { User02Icon, Briefcase01Icon } from '@hugeicons/core-free-icons';

export interface NavLinksProps {
	signedIn: boolean;
}

const signedInLinks = [
	{
		to: '/projects',
		label: 'Projects',
		icon: Briefcase01Icon,
	},
	/* {
		to: '/notifications',
		label: 'Notifications',
		icon: Bell,
	}, */
	{
		to: '/account',
		label: 'Account',
		icon: User02Icon,
	},
];

export const NavLinks = ({ signedIn }: NavLinksProps) => {
	const { pathname } = useLocation();

	return signedIn ? (
		<div className="flex items-center gap-8">
			{signedInLinks.map((link) => {
				const isActive = link.to === '/projects' ? pathname.startsWith('/project') : pathname.startsWith(link.to);
				return (
					<Link key={link.to} to={link.to} className={`text-sm font-semibold flex items-center gap-1 ${isActive ? 'text-primary' : ''}`}>
						<HugeiconsIcon icon={link.icon} className="size-5" />
						{link.label}
					</Link>
				);
			})}
		</div>
	) : (
		<div className="flex items-center gap-4">
			<Link to="/auth/login" className="font-semibold">
				Log in
			</Link>
			<Link to="/auth/signup">
				<Button size="lg" className="text-base px-4">
					Sign up
				</Button>
			</Link>
		</div>
	);
};
