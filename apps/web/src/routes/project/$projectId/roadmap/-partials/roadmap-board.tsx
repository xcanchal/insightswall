import { DndContext, PointerSensor, TouchSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { SuggestionStatus } from '@app/types';
import type { SuggestionWithVoteContextResponse } from '@/api/suggestions';
import { useRoadmapSuggestions, useUpdateSuggestionStatus, suggestionsKeys } from '@/hooks/use-suggestions';
import { useIsProjectAdmin } from '@/hooks/use-is-project-admin';
import { Spinner } from '@/components/spinner';
import { RoadmapColumn } from './roadmap-column';
import { EmptyRoadmap } from './empty-roadmap';

const ROADMAP_STATUSES: SuggestionStatus[] = ['PLANNED', 'IN_PROGRESS', 'DONE'];

interface RoadmapBoardProps {
	projectId: string;
}

export const RoadmapBoard = ({ projectId }: RoadmapBoardProps) => {
	const { data: suggestions, isLoading } = useRoadmapSuggestions(projectId);
	const { mutate: updateStatus } = useUpdateSuggestionStatus(projectId);
	const isAdmin = useIsProjectAdmin(projectId);
	const queryClient = useQueryClient();

	const sensors = useSensors(
		useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
		useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } })
	);

	const grouped = ROADMAP_STATUSES.reduce(
		(acc, status) => {
			acc[status] = (suggestions ?? []).filter((s) => s.status === status);
			return acc;
		},
		{} as Record<SuggestionStatus, SuggestionWithVoteContextResponse[]>
	);

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;
		if (!over) return;

		const suggestionId = active.id as string;
		const newStatus = over.id as SuggestionStatus;
		const suggestion = (suggestions ?? []).find((s) => s.id === suggestionId);

		if (!suggestion || suggestion.status === newStatus) return;

		// Optimistic update: snapshot and modify cache
		const queryKey = suggestionsKeys.byProjectId(projectId, { statuses: ROADMAP_STATUSES, sortBy: 'mostVoted' });
		const previous = queryClient.getQueryData<SuggestionWithVoteContextResponse[]>(queryKey);

		queryClient.setQueryData<SuggestionWithVoteContextResponse[]>(queryKey, (old) =>
			old?.map((s) => (s.id === suggestionId ? { ...s, status: newStatus } : s))
		);

		updateStatus(
			{ suggestionId, status: newStatus },
			{
				onError: () => {
					queryClient.setQueryData(queryKey, previous);
					toast.error('Failed to update status');
				},
				onSettled: () => {
					queryClient.invalidateQueries({ queryKey: [...suggestionsKeys.all, projectId] });
				},
			}
		);
	};

	if (isLoading) return <Spinner className="size-6 mx-auto py-12" />;

	if (!suggestions?.length) {
		return (
			<div className="flex flex-col items-center justify-center gap-4 py-11">
				<EmptyRoadmap isAdmin={isAdmin} />
			</div>
		);
	}

	return (
		<div className="flex flex-col py-2">
			<DndContext sensors={sensors} onDragEnd={handleDragEnd}>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-2">
					{ROADMAP_STATUSES.map((status) => (
						<RoadmapColumn key={status} status={status} suggestions={grouped[status]} isAdmin={isAdmin} />
					))}
				</div>
			</DndContext>
		</div>
	);
};
