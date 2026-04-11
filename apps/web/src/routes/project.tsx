import { createFileRoute, Outlet } from '@tanstack/react-router';
/* import { ProjectHeader } from '@/components/headers/project-header'; */
import { Footer } from '@/components/footer';
import { InternalHeader } from '@/components/headers/internal-header';

export const Route = createFileRoute('/project')({
	component: ProjectLayout,
});

function ProjectLayout() {
	return (
		<div className="flex flex-col min-h-screen">
			{/* <ProjectHeader /> */}
			<InternalHeader />
			<main className="flex-1">
				<Outlet />
			</main>
			<Footer />
		</div>
	);
}
