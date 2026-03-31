export type RoadmapStatus = 'PLANNED' | 'IN_PROGRESS' | 'DONE' | 'DISCONTINUED';

export interface RoadmapItem {
	id: string;
	projectId: string;
	suggestionId: string;
	status: RoadmapStatus;
	position: number;
	createdAt: string;
}
