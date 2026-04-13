import { useSession } from '@/lib/auth-client';
import { AuthButtons } from './-partials/auth-buttons';
import { HeaderContainer } from './-partials/header-container';
import { HeaderLogo } from './-partials/header-logo';
import { NavLinks } from './-partials/nav-links';

const navLinks = [
	{
		to: '/projects',
		label: 'Projects',
	},
];

export const ProjectHeader = () => {
	const { data: session } = useSession();

	console.log({ session });

	return (
		<HeaderContainer>
			<div className="flex items-center gap-6">
				<HeaderLogo />
				{!!session?.user && <NavLinks links={navLinks} />}
			</div>
			<div className="flex items-center gap-4">
				<AuthButtons signedIn={!!session?.user} />
			</div>
		</HeaderContainer>
	);
};
