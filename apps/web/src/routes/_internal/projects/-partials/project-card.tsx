import { Link } from '@tanstack/react-router';
import type { ProjectResponse } from '@/api/projects';
import { Button } from '@/components/ui/button';
import { HugeiconsIcon } from '@hugeicons/react';
import { Delete02Icon, MoreHorizontalCircle01Icon, PencilEdit02Icon, Warning } from '@hugeicons/core-free-icons';
import { ProjectIcon } from '@/components/project-icon';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useState } from 'react';
import { useDeleteProject, useUpdateProject } from '@/hooks/use-projects';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import * as z from 'zod';

const EditProjectSchema = z.object({
	name: z.string().trim().min(1, 'Name is required').max(50, 'Name must be at most 50 characters'),
	url: z.union([z.string().url('Must be a valid URL'), z.literal('')]),
});

export const ProjectCard = ({ project }: { project: ProjectResponse }) => {
	const [editOpen, setEditOpen] = useState(false);
	const [deleteOpen, setDeleteOpen] = useState(false);
	const [name, setName] = useState(project.name);
	const [url, setUrl] = useState(project.url ?? '');
	const [editError, setEditError] = useState<{ name?: string[]; url?: string[] }>({});

	const { mutate: updateProject, isPending: isUpdating } = useUpdateProject();
	const { mutate: deleteProject, isPending: isDeleting } = useDeleteProject();

	const handleEdit = (e: React.FormEvent) => {
		e.preventDefault();

		const validation = EditProjectSchema.safeParse({ name, url });
		if (!validation.success) {
			setEditError(validation.error.flatten().fieldErrors);
			return;
		}

		setEditError({});
		updateProject(
			{ projectId: project.id, data: { name: validation.data.name, url: validation.data.url || null } },
			{
				onSuccess: () => {
					toast.success('Project updated');
					setEditOpen(false);
				},
				onError: (e) => toast.error(e.message),
			}
		);
	};

	const handleDelete = () => {
		deleteProject(project.id, {
			onSuccess: () => {
				toast.success('Project deleted');
				setDeleteOpen(false);
			},
			onError: (e) => toast.error(e.message),
		});
	};

	return (
		<>
			<Dialog open={editOpen} onOpenChange={setEditOpen}>
				<DialogContent className="max-w-sm flex flex-col gap-4">
					<h2>Edit project</h2>
					<form onSubmit={handleEdit} className="flex flex-col gap-4">
						<Field>
							<FieldLabel htmlFor="name">Project name</FieldLabel>
							<Input
								id="name"
								name="name"
								value={name}
								onChange={(e) => {
									setName(e.target.value);
									if (editError.name) setEditError((current) => ({ ...current, name: undefined }));
								}}
								placeholder="Type project name..."
								autoFocus
							/>
							{editError.name && <FieldError errors={editError.name.map((message) => ({ message }))} />}
						</Field>
						<Field>
							<FieldLabel htmlFor="url">
								Website URL <span className="text-muted-foreground text-xs font-normal">(optional)</span>
							</FieldLabel>
							<Input
								id="url"
								name="url"
								value={url}
								onChange={(e) => {
									setUrl(e.target.value);
									if (editError.url) setEditError((current) => ({ ...current, url: undefined }));
								}}
								placeholder="https://myproduct.com"
								autoComplete="off"
							/>
							{editError.url && <FieldError errors={editError.url.map((message) => ({ message }))} />}
						</Field>
						<div className="flex justify-end gap-2">
							<Button type="button" variant="outline" onClick={() => setEditOpen(false)}>
								Cancel
							</Button>
							<Button type="submit" disabled={isUpdating || !name.trim()}>
								Save
							</Button>
						</div>
					</form>
				</DialogContent>
			</Dialog>

			<Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
				<DialogContent className="max-w-sm flex flex-col gap-4">
					<div className="flex flex-col gap-4">
						<h2>Delete project</h2>
						<p className="text-muted-foreground">
							Are you sure you want to delete <span className="font-medium text-foreground">{project.name}</span>?
						</p>
						<p className="bg-red-100 py-2 px-3 flex gap-3 rounded-md">
							<HugeiconsIcon icon={Warning} className="size-6 text-destructive" /> This will permanently delete the project and its related
							data.
						</p>
					</div>
					<div className="flex justify-end gap-2">
						<Button variant="outline" onClick={() => setDeleteOpen(false)}>
							Cancel
						</Button>
						<Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
							Yes, delete
						</Button>
					</div>
				</DialogContent>
			</Dialog>

			<div className="border rounded-lg group flex items-center justify-between h-20 px-6 cursor-pointer hover:bg-muted transition-colors">
				<Link
					to="/project/$projectId/suggestions"
					params={{ projectId: project.id }}
					className="text-foreground flex items-center gap-4 flex-1 self-stretch"
				>
					<ProjectIcon url={project.url} />
					<h3 className="font-semibold">{project.name}</h3>
				</Link>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" size="icon">
							<HugeiconsIcon icon={MoreHorizontalCircle01Icon} className="size-5" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuItem
							className="text-base"
							onSelect={() => {
								setName(project.name);
								setUrl(project.url ?? '');
								setEditError({});
								setEditOpen(true);
							}}
						>
							<HugeiconsIcon icon={PencilEdit02Icon} className="size-4" />
							Edit
						</DropdownMenuItem>
						<DropdownMenuItem variant="destructive" onSelect={() => setDeleteOpen(true)} className="text-base">
							<HugeiconsIcon icon={Delete02Icon} className="size-4" />
							Delete
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</>
	);
};
