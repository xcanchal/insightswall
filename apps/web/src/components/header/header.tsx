import { useSession } from '@/lib/auth-client';
import { NavLinks } from './-partials/nav-links';
import { HeaderContainer } from './-partials/header-container';
import { HeaderLogo } from './-partials/header-logo';

export const Header = () => {
	const { data: session } = useSession();
	return (
		<HeaderContainer>
			<HeaderLogo />
			<NavLinks signedIn={!!session?.user} />
		</HeaderContainer>
	);
};
