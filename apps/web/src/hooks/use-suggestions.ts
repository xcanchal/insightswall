import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { suggestionsApi, type CreateSuggestionInput } from '@/api/suggestions';

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
