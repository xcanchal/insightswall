import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
	suggestionsApi,
	type CreateSuggestionInput,
	type SuggestionQueryParams,
	type SuggestionWithVoteContextResponse,
} from '@/api/suggestions';
import type { SuggestionStatus } from '@app/types';

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

			const previous = queryClient.getQueryData<SuggestionWithVoteContextResponse[]>(suggestionsKeys.byProjectId(projectId, params));

			queryClient.setQueryData<SuggestionWithVoteContextResponse[]>(suggestionsKeys.byProjectId(projectId, params), (old) =>
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

export function useUpdateSuggestionStatus(projectId: string) {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ suggestionId, status, rejectionReason }: { suggestionId: string; status: SuggestionStatus; rejectionReason?: string }) =>
			suggestionsApi.updateStatus(projectId, suggestionId, status, rejectionReason),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [...suggestionsKeys.all, projectId] });
		},
	});
}

export function useRoadmapSuggestions(projectId: string | null | undefined) {
	const params: SuggestionQueryParams = { statuses: ['PLANNED', 'IN_PROGRESS', 'DONE'], sortBy: 'mostVoted' };
	return useQuery({
		queryKey: suggestionsKeys.byProjectId(projectId ?? '', params),
		queryFn: () => suggestionsApi.getByProjectId(projectId!, params),
		enabled: !!projectId,
	});
}

export function useDeleteSuggestion(projectId: string) {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (suggestionId: string) => suggestionsApi.deleteSuggestion(projectId, suggestionId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [...suggestionsKeys.all, projectId] });
		},
	});
}
