export interface ProjectEntity {
	id: string;
	name: string;
	url: string | null;
	createdAt: Date;
	updatedAt: Date | null;
}
