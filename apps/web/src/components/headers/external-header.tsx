import { BulbIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Link } from '@tanstack/react-router';
import { AuthButtons } from './-partials/auth-buttons';

export const ExternalHeader = () => (
	<header className="sticky top-0 bg-white z-10">
		<div className="container mx-auto flex items-center py-4 justify-between px-4 md:px-0">
			<div className="flex items-center gap-12">
				<Link to="/" className="font-bold flex items-center gap-1 font-heading text-lg">
					<HugeiconsIcon icon={BulbIcon} /> Insightswall
				</Link>
			</div>
			<div className="hidden md:flex items-center gap-4">
				<AuthButtons signedIn={false} />
			</div>
		</div>
	</header>
);
