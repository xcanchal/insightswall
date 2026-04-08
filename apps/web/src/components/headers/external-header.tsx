import { AuthButtons } from './-partials/auth-buttons';
import { HeaderLogo } from './-partials/header-logo';
import { HeaderContainer } from './-partials/header-container';

export const ExternalHeader = () => (
	<HeaderContainer>
		<>
			<div className="flex items-center gap-12">
				<HeaderLogo />
			</div>
			<div className="hidden md:flex items-center gap-4">
				<AuthButtons signedIn={false} />
			</div>
		</>
	</HeaderContainer>
);
