import { BulbIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Link } from '@tanstack/react-router';

export const AppHeader = () => (
	<header className="sticky top-0 bg-white shadow-sm z-10">
		<div className="container mx-auto flex items-center py-4 justify-between">
			<Link to="/" className="font-bold flex items-center gap-1 font-heading text-lg">
				<HugeiconsIcon icon={BulbIcon} /> Insightswall
			</Link>
			<div className="flex items-center gap-4">
				{/* TODO: notifications bell */}
				{/* TODO: avatar menu */}
			</div>
		</div>
	</header>
);
