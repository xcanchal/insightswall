import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header/header';

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
		<>
			<Header />
			<main className="flex-1">
				<Outlet />
			</main>
			<Footer />
		</>
	);
}
