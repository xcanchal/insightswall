import { AuthButtons } from './-partials/auth-buttons';
import { HeaderLogo } from './-partials/header-logo';
import { HeaderContainer } from './-partials/header-container';

export const ExternalHeader = () => (
	<HeaderContainer>
		<HeaderLogo />
		<AuthButtons signedIn={false} />
	</HeaderContainer>
);
