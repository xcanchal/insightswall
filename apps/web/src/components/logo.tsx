import { Link } from '@tanstack/react-router';
import { HugeiconsIcon } from '@hugeicons/react';
import { BulbIcon } from '@hugeicons/core-free-icons';

export const Logo = () => {
	return (
		<Link to="/" className="flex items-center gap-1 font-heading text-2xl font-black tracking-tight transition-colors ">
			<HugeiconsIcon icon={BulbIcon} /> Insightswall
		</Link>
	);
};
