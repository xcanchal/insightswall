import { createFileRoute, useNavigate, useParams } from '@tanstack/react-router';
import { useState } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';
import { SUGGESTION_CATEGORIES, SUGGESTION_STATUSES, type SuggestionCategory, type SuggestionStatus } from '@app/types';
import { useCreateSuggestion, useSuggestionsByProjectId } from '@/hooks/use-suggestions';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { EmptySuggestions } from './-partials/empty-suggestions';
import { CreateSuggestionForm } from './-partials/create-suggestion-form';
import { CreateButton } from '@/components/create-button';
import { SuggestionsFilters } from './-partials/suggestions-filters';
import { SuggestionCard } from './-partials/suggestion-card';
import { useIsProjectAdmin } from '@/hooks/use-is-project-admin';
import { ProtectedActionDialog } from '@/components/protected-action-dialog';
import { useSession } from '@/lib/auth-client';
import { Spinner } from '@/components/spinner';
import { AlertBanner } from '@/components/alert';

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
	const {
		search = '',
		statuses = [...SUGGESTION_STATUSES],
		categories = [...SUGGESTION_CATEGORIES],
		show = 'mostVoted',
	} = Route.useSearch();

	const navigate = useNavigate({ from: Route.fullPath });
	const debouncedSearch = useDebouncedValue(search, 300);
	const queryParams = { sortBy: show, categories, statuses, search: debouncedSearch || undefined };

	const [createSuggestionDialogOpen, setCreateSuggestionDialogOpen] = useState(false);
	const [protectedActionDialogOpen, setProtectedActionDialogOpen] = useState(false);
	const { data: session } = useSession();

	const { data: suggestions, isLoading: loadingSuggestions, isFetching, error } = useSuggestionsByProjectId(projectId ?? null, queryParams);
	const { mutateAsync } = useCreateSuggestion(projectId!);

	const isProjectAdmin = useIsProjectAdmin(projectId ?? '');
	const hasActiveFilters =
		!!debouncedSearch || categories.length !== SUGGESTION_CATEGORIES.length || statuses.length !== SUGGESTION_STATUSES.length;

	// TODO: const isSuggestionAuthor = useSuggestionAuthor(projectId ?? '');

	const setSearch = (search: string) => navigate({ search: (prev) => ({ ...prev, search: search || undefined }), replace: true });
	const setStatuses = (statuses: SuggestionStatus[]) => navigate({ search: (prev) => ({ ...prev, statuses }) });
	const setCategories = (categories: SuggestionCategory[]) => navigate({ search: (prev) => ({ ...prev, categories }) });
	const setShow = (show: 'mostVoted' | 'newest') => navigate({ search: (prev) => ({ ...prev, show }) });

	const handleCreateSuggestion = () => {
		if (!session?.user) {
			setProtectedActionDialogOpen(true);
			return;
		}
		setCreateSuggestionDialogOpen(true);
	};

	const submit = async (values: { description: string; category: SuggestionCategory }) => {
		await mutateAsync(
			{ projectId: projectId!, ...values },
			{
				onSuccess: () => {
					toast.success('Suggestion submitted');
					setCreateSuggestionDialogOpen(false);
				},
				onError: (e) => toast.error(e.message),
			}
		);
	};

	return (
		<div className="flex flex-col gap-3">
			<Dialog open={createSuggestionDialogOpen} onOpenChange={setCreateSuggestionDialogOpen}>
				<div className="flex justify-end">
					<DialogContent>
						<CreateSuggestionForm onSubmit={submit} onCancel={() => setCreateSuggestionDialogOpen(false)} />
					</DialogContent>
				</div>
				{loadingSuggestions && !hasActiveFilters ? (
					<Spinner className="size-6" />
				) : error ? (
					<AlertBanner type="error" message="Failed to load suggestions" />
				) : (suggestions ?? []).length === 0 && !hasActiveFilters && !isFetching ? (
					<div className="flex flex-col items-center justify-center gap-4 py-8">
						<EmptySuggestions />
						<CreateButton label="Submit suggestion" onClick={handleCreateSuggestion} size="lg" />
					</div>
				) : (
					<div className="flex flex-col gap-6">
						<div className="flex flex-col sm:flex-row items-center justify-between gap-2">
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
							<CreateButton label="Submit suggestion" onClick={handleCreateSuggestion} />
						</div>
						{isFetching ? (
							<Spinner className="size-6" />
						) : (suggestions ?? []).length === 0 ? (
							<p className="text-sm text-muted-foreground text-center py-8">No suggestions match your search.</p>
						) : (
							<div className="flex flex-col gap-3 p-3 rounded-xl bg-neutral-50">
								{(suggestions ?? []).map((suggestion) => (
									<SuggestionCard
										key={suggestion.id}
										suggestion={suggestion}
										/* isOwner={isSuggestionAuthor} */
										isProjectAdmin={isProjectAdmin}
										queryParams={queryParams}
									/>
								))}
							</div>
						)}
					</div>
				)}
			</Dialog>
			<ProtectedActionDialog
				isOpen={protectedActionDialogOpen}
				onOpenChange={setProtectedActionDialogOpen}
				message="Create a free account or log in to submit a suggestion."
			/>
		</div>
	);
}
