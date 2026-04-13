import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { suggestionsApi, type CreateSuggestionInput, type SuggestionResponse } from '@/api/suggestions';

export const suggestionsKeys = {
	all: ['suggestions'] as const,
	byProjectId: (projectId: string) => [...suggestionsKeys.all, projectId] as const,
};

export function useSuggestionsByProjectId(projectId: string | null | undefined) {
	return useQuery({
		queryKey: suggestionsKeys.byProjectId(projectId ?? ''),
		queryFn: () => suggestionsApi.getByProjectId(projectId!),
		enabled: !!projectId,
	});
}

export function useCreateSuggestion(projectId: string) {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: CreateSuggestionInput) => suggestionsApi.create(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: suggestionsKeys.byProjectId(projectId) });
		},
	});
}

export function useVoteSuggestion(projectId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ suggestionId, userHasVoted }: { suggestionId: string; userHasVoted: boolean }) =>
			userHasVoted ? suggestionsApi.unvote(suggestionId) : suggestionsApi.vote(suggestionId),

		onMutate: async ({ suggestionId, userHasVoted }) => {
			await queryClient.cancelQueries({ queryKey: suggestionsKeys.byProjectId(projectId) });

			const previous = queryClient.getQueryData<SuggestionResponse[]>(suggestionsKeys.byProjectId(projectId));

			queryClient.setQueryData<SuggestionResponse[]>(suggestionsKeys.byProjectId(projectId), (old) =>
				old?.map((s) =>
					s.id === suggestionId
						? { ...s, userHasVoted: !userHasVoted, voteCount: userHasVoted ? s.voteCount - 1 : s.voteCount + 1 }
						: s
				)
			);

			return { previous };
		},

		onError: (_err, _vars, context) => {
			if (context?.previous) {
				queryClient.setQueryData(suggestionsKeys.byProjectId(projectId), context.previous);
			}
		},
	});
}
