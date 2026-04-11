import { createFileRoute, useNavigate, useParams } from '@tanstack/react-router';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';
import { SUGGESTION_CATEGORIES, SUGGESTION_STATUSES, type SuggestionCategory, type SuggestionStatus } from '@app/types';
import { useCreateSuggestion, useSuggestionsByProjectId } from '@/hooks/use-suggestions';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { EmptySuggestions } from './-partials/empty-suggestions';
import { CreateSuggestionForm } from './-partials/create-suggestion-form';
import { CreateButton } from '@/components/create-button';
import { SuggestionsFilters } from './-partials/suggestions-filters';
import { SuggestionCard } from './-partials/suggestion-card';
import { useIsProjectAdmin } from '@/hooks/use-is-project-admin';

const searchSchema = z.object({
	search: z.string().optional(),
	statuses: z.array(z.enum(SUGGESTION_STATUSES)).optional(),
	categories: z.array(z.enum(SUGGESTION_CATEGORIES)).optional(),
	show: z.enum(['mostVoted', 'newest']).optional(),
});

export const Route = createFileRoute('/project/$projectId/suggestions/')({
	validateSearch: searchSchema,
	component: ProjectSuggestions,
});

function ProjectSuggestions() {
	const { projectId } = useParams({ strict: false });
	const { data: suggestions } = useSuggestionsByProjectId(projectId ?? null);
	const { mutateAsync } = useCreateSuggestion(projectId!);
	const [dialogOpen, setDialogOpen] = useState(false);

	const {
		search = '',
		statuses = [...SUGGESTION_STATUSES],
		categories = [...SUGGESTION_CATEGORIES],
		show = 'mostVoted',
	} = Route.useSearch();
	const navigate = useNavigate({ from: Route.fullPath });

	const isProjectAdmin = useIsProjectAdmin(projectId ?? '');
	const isSuggestionAuthor = false;
	// TODO: const isSuggestionAuthor = useSuggestionAuthor(projectId ?? '');

	const setSearch = (search: string) => navigate({ search: (prev) => ({ ...prev, search: search || undefined }) });
	const setStatuses = (statuses: SuggestionStatus[]) => navigate({ search: (prev) => ({ ...prev, statuses }) });
	const setCategories = (categories: SuggestionCategory[]) => navigate({ search: (prev) => ({ ...prev, categories }) });
	const setShow = (show: 'mostVoted' | 'newest') => navigate({ search: (prev) => ({ ...prev, show }) });

	const submit = async (values: { description: string; category: SuggestionCategory }) => {
		await mutateAsync(
			{ projectId: projectId!, ...values },
			{
				onSuccess: () => {
					toast.success('Suggestion submitted');
					setDialogOpen(false);
				},
				onError: (e) => toast.error(e.message),
			}
		);
	};

	/* const DialogTriggerComponent = useMemo(() => {
		return (
			<DialogTrigger asChild className="w-fit self-center">
				<CreateButton label="Create suggestion" onClick={() => setDialogOpen(true)} />
			</DialogTrigger>
		);
	}, []); */

	return (
		<div className="flex flex-col gap-2">
			<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
				<div className="flex justify-end">
					<DialogContent>
						<CreateSuggestionForm onSubmit={submit} onCancel={() => setDialogOpen(false)} />
					</DialogContent>
				</div>
				{(suggestions ?? []).length > 0 ? (
					<div className="flex flex-col gap-4">
						<div className="flex items-center justify-between gap-2">
							<SuggestionsFilters
								search={search}
								categories={categories}
								statuses={statuses}
								show={show}
								onSearchChange={setSearch}
								onCategoryChange={setCategories}
								onStatusChange={setStatuses}
								onShowChange={setShow}
							/>
							<DialogTrigger asChild className="w-fit self-center">
								<CreateButton label="Create suggestion" onClick={() => setDialogOpen(true)} />
							</DialogTrigger>
						</div>
						{(suggestions ?? []).map((suggestion) => (
							<SuggestionCard key={suggestion.id} suggestion={suggestion} isOwner={isSuggestionAuthor} isProjectAdmin={isProjectAdmin} />
						))}
					</div>
				) : (
					<div className="flex flex-col items-center justify-center gap-4 py-8">
						<EmptySuggestions />
						<DialogTrigger asChild className="w-fit self-center">
							<CreateButton label="Create suggestion" onClick={() => setDialogOpen(true)} size="lg" />
						</DialogTrigger>
					</div>
				)}
			</Dialog>
		</div>
	);
}
