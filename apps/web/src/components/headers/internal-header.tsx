import { HeaderLogo } from './-partials/header-logo';
import { HeaderContainer } from './-partials/header-container';
import { AuthButtons } from './-partials/auth-buttons';

export const InternalHeader = () => {
	return (
		<HeaderContainer>
			<HeaderLogo />
			<AuthButtons signedIn />
		</HeaderContainer>
	);
};
