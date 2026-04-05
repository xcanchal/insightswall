import { createFileRoute, Outlet, Link } from '@tanstack/react-router';
import { BulbIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

export const Route = createFileRoute('/_external/auth/_layout')({
	component: AuthLayout,
});

function AuthLayout() {
	return (
		<div className="flex flex-col min-h-screen">
			<header className="p-6">
				<Link to="/" className="font-bold flex items-center gap-1 font-heading text-lg w-fit">
					<HugeiconsIcon icon={BulbIcon} /> Insightswall
				</Link>
			</header>
			<main className="flex-1 flex items-center justify-center">
				<Outlet />
			</main>
		</div>
	)
}
