import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { EmptyProjects } from './-partials/empty-projects';
import { useCreateProject, projectsKeys, useProjects } from '@/hooks/use-projects';
import { useMemo, useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { CreateProjectForm } from './-partials/create-project-form';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { ProjectsList } from './-partials/projects-list';
import { CreateButton } from '@/components/create-button';
import { Spinner } from '@/components/spinner';
import { AlertBanner } from '@/components/alert';

export const Route = createFileRoute('/_internal/projects/')({
	component: UserProjects,
});

function UserProjects() {
	const { data: projects, isLoading: loadingProjects, error: loadingError } = useProjects();
	const [dialogOpen, setDialogOpen] = useState(false);
	const { mutateAsync } = useCreateProject();
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	const submitCreateProject = async (values: { name: string }) => {
		await mutateAsync(values, {
			onSuccess: (project) => {
				queryClient.invalidateQueries({ queryKey: projectsKeys.all });
				toast.success(`Project "${project.name}" created successfully`);
				navigate({ to: '/project/$projectId/suggestions', params: { projectId: project.id } });
			},
			onError: (error) => {
				toast.error(error.message);
			},
		});
	};

	const DialogTriggerComponent = useMemo(() => {
		return (
			<DialogTrigger>
				<CreateButton label="Create project" onClick={() => setDialogOpen(true)} />
			</DialogTrigger>
		);
	}, []);

	return (
		<div className="container mx-auto flex flex-col gap-6 flex-1 items-center justify-center px-4 sm:px-0 py-8 max-w-2xl">
			<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
				{projects?.length ? (
					<>
						<div className="flex items-center justify-between w-full">
							<h1>Projects</h1>
							{DialogTriggerComponent}
						</div>
						<ProjectsList projects={projects} />
					</>
				) : (
					<>
						{loadingError ? (
							<AlertBanner type="error" message="Failed to load projects" />
						) : (
							<>
								{loadingProjects ? (
									<Spinner className="size-6" />
								) : (
									<>
										<EmptyProjects />
										{DialogTriggerComponent}
									</>
								)}
							</>
						)}
					</>
				)}

				<DialogContent>
					<CreateProjectForm onSubmit={submitCreateProject} onCancel={() => setDialogOpen(false)} />
				</DialogContent>
			</Dialog>
		</div>
	);
}
