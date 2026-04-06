import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuItem,
	SidebarMenuButton,
} from '@/components/ui/sidebar';
import { Link } from '@tanstack/react-router';
import { HugeiconsIcon } from '@hugeicons/react';
import { BulbIcon, SettingsIcon, User02Icon, WorkIcon } from '@hugeicons/core-free-icons';
import { useSession } from '@/lib/auth-client';
/* import { signOut } from '@/lib/auth-client';
import { Button } from './ui/button'; */

const menuItems = [
	{
		icon: WorkIcon,
		name: 'Projects',
		url: '/projects',
	},
	{
		icon: SettingsIcon,
		name: 'Settings',
		url: '/settings',
	} /* ,
	{
		icon: LogoutIcon,
		name: 'Logout',
		url: '/auth/logout',
	}, */,
];

export function InternalSidebar() {
	const { data: session } = useSession();

	return (
		<Sidebar>
			<SidebarHeader className="px-4">
				<Link to="/" className="font-bold flex items-center gap-1 font-heading text-lg pt-1 pb-2">
					<HugeiconsIcon icon={BulbIcon} /> Insightswall
				</Link>
				<div className="flex flex-col gap-1 border rounded-lg p-2">
					<div className="flex items-center gap-2">
						<HugeiconsIcon icon={User02Icon} className="size-6" />
						<div className="flex flex-col gap-1">
							<span className="text-sm">{session?.user?.name}</span>
							<span className="text-xs text-muted-foreground">{session?.user?.email}</span>
						</div>
					</div>
					{/* <Button onClick={() => signOut()} size="xs" variant="ghost">
						Log out
					</Button> */}
				</div>
			</SidebarHeader>
			<SidebarContent className="px-4">
				<SidebarMenu className="py-2 gap-2">
					{menuItems.map((item) => (
						<SidebarMenuItem key={item.name}>
							<SidebarMenuButton asChild>
								<Link to={item.url}>
									<HugeiconsIcon icon={item.icon} />
									<span>{item.name}</span>
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
					))}
				</SidebarMenu>
			</SidebarContent>
			<SidebarFooter className="px-4">
				<div className="flex flex-col gap-2 border rounded-lg p-2">
					<div className="flex items-center gap-2">
						<HugeiconsIcon icon={User02Icon} className="size-6" />
						<div className="flex flex-col gap-1">
							<span className="text-sm">{session?.user?.name}</span>
							<span className="text-xs text-muted-foreground">{session?.user?.email}</span>
						</div>
					</div>
					{/* <Button onClick={() => signOut()} size="xs" variant="ghost">
						Log out
					</Button> */}
				</div>
			</SidebarFooter>
		</Sidebar>
	);
}
