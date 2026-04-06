import { BulbIcon, LogoutIcon, User02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { signOut } from '@/lib/auth-client';
import { useSession } from '@/lib/auth-client';

export const InternalHeader = () => {
	const { data: session } = useSession();
	return (
		<header className="sticky top-0 bg-white shadow-sm z-10">
			<div className="container mx-auto flex items-center py-4 justify-between">
				<Link to="/" className="font-bold flex items-center gap-1 font-heading text-lg">
					<HugeiconsIcon icon={BulbIcon} /> Insightswall
				</Link>
				<div className="flex items-center gap-4">
					{/* TODO: notifications bell */}
					{/* TODO: avatar menu */}
					<div className="flex items-center gap-2 bg-muted rounded-full px-2 py-1">
						<HugeiconsIcon icon={User02Icon} className="size-4" /> <span className="text-sm">{session?.user?.name}</span>
						<span className="text-xs text-muted-foreground">({session?.user?.email})</span>
					</div>
					{/* <Button onClick={() => signOut()}>
						<HugeiconsIcon icon={LogoutIcon} /> Logout
					</Button> */}
				</div>
			</div>
		</header>
	);
};
