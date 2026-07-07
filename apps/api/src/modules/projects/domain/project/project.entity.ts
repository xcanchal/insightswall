export interface ProjectEntity {
	id: string;
	name: string;
	url: string | null;
	isRoadmapPublic: boolean;
	createdAt: Date;
	updatedAt: Date | null;
}
