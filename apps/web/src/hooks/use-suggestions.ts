import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { suggestionsApi, type CreateSuggestionInput, type SuggestionQueryParams, type SuggestionResponse } from '@/api/suggestions';

export const suggestionsKeys = {
	all: ['suggestions'] as const,
	byProjectId: (projectId: string, params: SuggestionQueryParams) => [...suggestionsKeys.all, projectId, params] as const,
};

export function useSuggestionsByProjectId(projectId: string | null | undefined, params: SuggestionQueryParams = {}) {
	return useQuery({
		queryKey: suggestionsKeys.byProjectId(projectId ?? '', params),
		queryFn: () => suggestionsApi.getByProjectId(projectId!, params),
		enabled: !!projectId,
	});
}

export function useCreateSuggestion(projectId: string) {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: CreateSuggestionInput) => suggestionsApi.create(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [...suggestionsKeys.all, projectId] });
		},
	});
}

export function useVoteSuggestion(projectId: string, params: SuggestionQueryParams = {}) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ suggestionId, userHasVoted }: { suggestionId: string; userHasVoted: boolean }) =>
			userHasVoted ? suggestionsApi.unvote(suggestionId) : suggestionsApi.vote(suggestionId),

		onMutate: async ({ suggestionId, userHasVoted }) => {
			await queryClient.cancelQueries({ queryKey: suggestionsKeys.byProjectId(projectId, params) });

			const previous = queryClient.getQueryData<SuggestionResponse[]>(suggestionsKeys.byProjectId(projectId, params));

			queryClient.setQueryData<SuggestionResponse[]>(suggestionsKeys.byProjectId(projectId, params), (old) =>
				old?.map((s) =>
					s.id === suggestionId ? { ...s, userHasVoted: !userHasVoted, voteCount: userHasVoted ? s.voteCount - 1 : s.voteCount + 1 } : s
				)
			);

			return { previous };
		},

		onError: (_err, _vars, context) => {
			if (context?.previous) {
				queryClient.setQueryData(suggestionsKeys.byProjectId(projectId, params), context.previous);
			}
		},
	});
}
