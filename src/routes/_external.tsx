import { createFileRoute, Outlet } from '@tanstack/react-router';
import { Header } from '@/components/header/header';
import { Footer } from '@/components/footer';

export const Route = createFileRoute('/_external')({
	component: ExternalLayout,
});

function ExternalLayout() {
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
