import { createFileRoute, Outlet } from '@tanstack/react-router';
import { ExternalHeader } from '@/components/headers/external-header';
import { Footer } from '@/components/footer';

export const Route = createFileRoute('/_external')({
	component: ExternalLayout,
});

function ExternalLayout() {
	return (
		<div className="flex flex-col min-h-screen">
			<ExternalHeader />
			<main className="flex-1">
				<Outlet />
			</main>
			<Footer />
		</div>
	);
}
