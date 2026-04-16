import { Link } from '@tanstack/react-router';
/* import { HugeiconsIcon } from '@hugeicons/react';
import { BulbIcon } from '@hugeicons/core-free-icons'; */

export const HeaderLogo = () => {
	return (
		<Link to="/" className="font-bold flex items-center gap-1 font-heading text-xl">
			{/* <HugeiconsIcon icon={BulbIcon} /> */} Insightswall
		</Link>
	);
};
