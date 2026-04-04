import { createFileRoute, Outlet } from '@tanstack/react-router';
import { MarketingHeader } from '@/components/headers/marketing-header';
import { Footer } from '@/components/footer';

export const Route = createFileRoute('/_marketing')({
	component: MarketingLayout,
});

function MarketingLayout() {
	return (
		<div className="flex flex-col min-h-screen">
			<MarketingHeader />
			<main className="flex-1">
				<Outlet />
			</main>
			<Footer />
		</div>
	);
}
