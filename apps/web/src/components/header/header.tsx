import { useLocation } from '@tanstack/react-router';
import { useSession } from '@/lib/auth-client';
import { NavLinks } from './-partials/nav-links';
import { HeaderContainer } from './-partials/header-container';
import { Logo } from '@/components/logo';

const landingLinks = [
	{ href: '#features', label: 'Features' },
	{ href: '#how-it-works', label: 'How it works' },
	{ href: '#scattered-feedback', label: 'Centralization' },
	{ href: '#use-cases', label: 'Use cases' },
];

export const Header = () => {
	const { data: session } = useSession();
	const { pathname } = useLocation();
	const isLanding = pathname === '/';

	return (
		<HeaderContainer>
			<div className="flex items-center gap-8">
				<Logo />
				{isLanding && (
					<nav className="hidden md:flex items-center gap-6">
						{landingLinks.map((link) => (
							<a key={link.href} href={link.href} className="text-sm font-medium text-zinc-600 hover:text-zinc-950">
								{link.label}
							</a>
						))}
					</nav>
				)}
			</div>
			<NavLinks signedIn={!!session?.user} />
		</HeaderContainer>
	);
};
