import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header/header';
import { authClient } from '@/lib/auth-client';

export const Route = createFileRoute('/_internal')({
	// Authenticated app pages: no SEO value, and the session lives in a
	// browser cookie, so render them on the client only.
	ssr: false,
	beforeLoad: async () => {
		const { data: session } = await authClient.getSession();
		if (!session) {
			throw redirect({ to: '/auth/login' });
		}
		return { session };
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
