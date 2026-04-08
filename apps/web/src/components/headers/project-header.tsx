import { useParams } from '@tanstack/react-router';
import { useSession } from '@/lib/auth-client';
import { AuthButtons } from './-partials/auth-buttons';
import { NavLinks } from './-partials/nav-links';
import { ProjectSwitcher } from './-partials/project-switcher';
import { useProjects } from '@/hooks/use-projects';
import { HeaderContainer } from './-partials/header-container';
import { HeaderLogo } from './-partials/header-logo';

const navLinks = [
	{ to: '/project/$projectSlug/suggestions', label: 'Suggestions' },
	{ to: '/project/$projectSlug/roadmap', label: 'Roadmap' },
];

export const ProjectHeader = () => {
	const { data: session } = useSession();
	const { projectSlug } = useParams({ strict: false });
	const { data: projects = [] } = useProjects();
	const currentProject = projects.find((p) => p.slug === projectSlug);

	return (
		<HeaderContainer>
			<div className="flex items-center gap-6">
				<HeaderLogo />
				{currentProject && (
					<>
						<ProjectSwitcher currentProject={currentProject} />
						<NavLinks links={navLinks} />
					</>
				)}
			</div>
			<div className="flex items-center gap-4">
				<AuthButtons signedIn={!!session?.user} />
			</div>
		</HeaderContainer>
	);
};
