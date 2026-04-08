import { Bell, User02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { NavLinks } from './-partials/nav-links';
import { HeaderLogo } from './-partials/header-logo';
import { HeaderContainer } from './-partials/header-container';

const navLinks = [
	{
		to: '/projects',
		label: 'Projects',
	},
];

export const InternalHeader = () => {
	return (
		<HeaderContainer>
			<div className="flex items-center gap-8">
				<HeaderLogo />
				<div className="flex items-start gap-4">
					<NavLinks links={navLinks} />
				</div>
			</div>
			<div className="flex items-center gap-4">
				<Button variant="ghost" size="icon">
					<HugeiconsIcon icon={Bell} className="size-6" />
				</Button>
				<Link to="/account">
					<Button variant="ghost" size="icon">
						<HugeiconsIcon icon={User02Icon} className="size-6" />
					</Button>
				</Link>
			</div>
		</HeaderContainer>
	);
};
