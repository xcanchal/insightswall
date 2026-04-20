import { useSession } from '@/lib/auth-client';
import { AuthButtons } from './-partials/auth-buttons';
import { HeaderContainer } from './-partials/header-container';
import { HeaderLogo } from './-partials/header-logo';

export const Header = () => {
	const { data: session } = useSession();
	return (
		<HeaderContainer>
			<HeaderLogo />
			<AuthButtons signedIn={!!session?.user} />
		</HeaderContainer>
	);
};
