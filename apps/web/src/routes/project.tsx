import { createFileRoute, Outlet } from '@tanstack/react-router';
import { Header } from '@/components/header/header';
import { Footer } from '@/components/footer';

export const Route = createFileRoute('/project')({
	component: ProjectLayout,
});

function ProjectLayout() {
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
