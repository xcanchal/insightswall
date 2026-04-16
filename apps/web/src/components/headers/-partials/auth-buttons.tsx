import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { HugeiconsIcon } from '@hugeicons/react';
import { /* Bell,  */ User02Icon, Briefcase01Icon, Bell } from '@hugeicons/core-free-icons';

export interface AuthButtonsProps {
	signedIn: boolean;
}

const signedInLinks = [
	{
		to: '/projects',
		label: 'Projects',
		icon: Briefcase01Icon,
	},
	{
		to: '/notifications',
		label: 'Notifications',
		icon: Bell,
	},
	{
		to: '/account',
		label: 'Account',
		icon: User02Icon,
	},
];

export const AuthButtons = ({ signedIn }: AuthButtonsProps) => {
	return signedIn ? (
		<div className="flex items-center gap-8">
			{signedInLinks.map((link) => (
				<Link key={link.to} to={link.to} className="text-sm font-semibold flex items-center gap-1">
					<HugeiconsIcon icon={link.icon} className="size-5" />
					{link.label}
				</Link>
			))}
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
