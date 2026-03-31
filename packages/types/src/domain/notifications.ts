export type NotificationType =
	| 'SUGGESTION_CREATED'
	| 'SUGGESTION_REJECTED'
	| 'SUGGESTION_COMMENT'
	| 'ADDED_TO_ROADMAP'
	| 'ROADMAP_STATUS_CHANGED';

export interface Notification {
	id: string;
	userId: string;
	projectId: string;
	suggestionId: string | null;
	roadmapItemId: string | null;
	type: NotificationType;
	title: string;
	message: string;
	isRead: boolean;
	createdAt: string;
}
