import { BulbIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Link, useParams } from '@tanstack/react-router';
import { useSession } from '@/lib/auth-client';
import { AuthButtons } from './-partials/auth-buttons';
import { NavLinks } from './-partials/nav-links';
import { ProjectSwitcher } from './-partials/project-switcher';
import { useProjects } from '@/hooks/use-projects';
import { Separator } from '@/components/ui/separator';

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
		<header className="sticky top-0 bg-white z-10">
			<div className="container mx-auto flex items-center py-4 justify-between">
				<div className="flex items-center gap-6">
					<Link to="/" className="font-bold flex items-center gap-1 font-heading text-lg">
						<HugeiconsIcon icon={BulbIcon} /> Insightswall
					</Link>
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
			</div>
		</header>
	);
};
