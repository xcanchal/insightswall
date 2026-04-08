import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { EmptyProjects } from './-partials/empty-projects';
import { useCreateProject, projectsKeys, useProjects } from '@/hooks/use-projects';
import { ProjectCard } from './-partials/project-card';
import { HugeiconsIcon } from '@hugeicons/react';
import { Alert02Icon, Loading03Icon } from '@hugeicons/core-free-icons';
import { Alert } from '@/components/ui/alert';
import { useMemo, useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { CreateProjectButton } from './-partials/create-project-button';
import { CreateProjectForm } from './-partials/create-project-form';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

export const Route = createFileRoute('/_internal/projects/')({
	component: UserProjects,
});

function UserProjects() {
	const { data: projects, isLoading, error } = useProjects();
	const [dialogOpen, setDialogOpen] = useState(false);
	const { mutateAsync } = useCreateProject();
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	const submitCreateProject = async (values: { name: string; slug: string }) => {
		await mutateAsync(values, {
			onSuccess: (project) => {
				queryClient.invalidateQueries({ queryKey: projectsKeys.all });
				toast.success(`Project "${project.name}" created successfully`);
				navigate({ to: '/project/$projectSlug/suggestions', params: { projectSlug: project.slug } });
			},
			onError: (error) => {
				toast.error(error.message);
			},
		});
	};

	const Content = useMemo(() => {
		if (isLoading)
			return (
				<div className="h-full w-full flex flex-1 items-center justify-center">
					<HugeiconsIcon icon={Loading03Icon} className="size-6 animate-spin" />
				</div>
			);
		if (error)
			return (
				<Alert variant="destructive">
					<HugeiconsIcon icon={Alert02Icon} /> Error loading projects
				</Alert>
			);

		return (
			<>
				{projects && projects.length > 0 ? (
					<>
						<div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 py-6">
							{projects.map((project) => (
								<ProjectCard key={project.id} project={project} />
							))}
						</div>
					</>
				) : (
					<EmptyProjects />
				)}
			</>
		);
	}, [isLoading, error, projects]);

	return (
		<div className="container mx-auto flex flex-col flex-1 items-center justify-center px-4 sm:px-0 py-8">
			<div className="flex items-center justify-between w-full">
				<h1>Projects</h1>

				<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
					<DialogTrigger>
						<CreateProjectButton onClick={() => setDialogOpen(true)} />
					</DialogTrigger>
					<DialogContent>
						<CreateProjectForm onSubmit={submitCreateProject} onCancel={() => setDialogOpen(false)} />
					</DialogContent>
				</Dialog>
			</div>
			{Content}
		</div>
	);
}
