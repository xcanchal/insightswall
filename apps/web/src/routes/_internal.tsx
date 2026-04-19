import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { Footer } from '@/components/footer';
import { InternalHeader } from '@/components/headers/internal-header';

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
		<div className="flex flex-col min-h-screen">
			<InternalHeader />
			<main className="flex-1">
				<Outlet />
			</main>
			<Footer />
		</div>
	);
}
