import type { RoadmapItem, RoadmapStatus } from '../domain/roadmap-items.ts';
import type { ApiResponse } from './common.ts';

export type GetRoadmapItemsResponse = ApiResponse<RoadmapItem[]>;

export interface AddRoadmapItemRequest {
	suggestionId: string;
	status: RoadmapStatus;
}
export type AddRoadmapItemResponse = ApiResponse<RoadmapItem>;

export interface UpdateRoadmapItemRequest {
	status?: RoadmapStatus;
	position?: number;
}
export type UpdateRoadmapItemResponse = ApiResponse<RoadmapItem>;

export interface ReorderRoadmapItemsRequest {
	items: Array<{ id: string; status: RoadmapStatus; position: number }>;
}
export type ReorderRoadmapItemsResponse = ApiResponse<RoadmapItem[]>;
