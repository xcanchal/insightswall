import { Link } from '@tanstack/react-router';

export interface NavLinksProps {
	links: {
		to: string;
		label: string;
	}[];
}

const activeProps = {
	className: 'text-primary',
};

export const NavLinks = ({ links }: NavLinksProps) => {
	return (
		<nav className="flex items-center gap-6">
			{links.map((link) => (
				<Link key={link.to} to={link.to} className="text-sm font-semibold" activeProps={activeProps}>
					{link.label}
				</Link>
			))}
		</nav>
	);
};
