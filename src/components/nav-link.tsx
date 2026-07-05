import { Link } from '@tanstack/react-router';

export const NavLink = ({
	to,
	children,
	activeProps,
}: {
	to: string;
	children: React.ReactNode;
	activeProps?: React.ComponentProps<typeof Link>['activeProps'];
}) => {
	return (
		<Link to={to} activeProps={activeProps}>
			{children}
		</Link>
	);
};
