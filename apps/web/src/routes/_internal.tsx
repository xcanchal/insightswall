import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { Footer } from '@/components/footer';
import { InternalHeader } from '@/components/headers/internal-header';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { InternalSidebar } from '@/components/internal-sidebar';

export const Route = createFileRoute('/_internal')({
	beforeLoad: ({ context }) => {
		if (!context.isPending && !context.session) {
			throw redirect({ to: '/auth/login' });
		}
	},
	component: InternalLayout,
});

function InternalLayout() {
	return (
		<div className="flex min-h-screen">
			<SidebarProvider>
				<InternalSidebar />
				{/* <InternalHeader /> */}
				<main className="flex-1">
					<Outlet />
				</main>
			</SidebarProvider>
			{/* <Footer /> */}
		</div>
	);
}
