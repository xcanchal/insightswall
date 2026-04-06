import { Bell, BulbIcon, User02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { NavLink } from '../nav-link';

export const InternalHeader = () => {
	return (
		<header className="sticky top-0 bg-white shadow-sm z-10">
			<div className="container mx-auto flex items-center py-4 justify-between">
				<div className="flex items-center gap-8">
					<Link to="/" className="font-bold flex items-center gap-1 font-heading text-lg">
						<HugeiconsIcon icon={BulbIcon} /> Insightswall
					</Link>
					<div className="flex items-start gap-4">
						<NavLink to="/projects">Projects</NavLink>
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
			</div>
		</header>
	);
};
