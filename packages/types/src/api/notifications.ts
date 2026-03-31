import type { Notification } from '../domain/notifications.ts';
import type { ApiResponse, PaginatedResponse } from './common.ts';

export type GetNotificationsResponse = PaginatedResponse<Notification>;
export type MarkNotificationReadResponse = ApiResponse<Notification>;
export type MarkAllNotificationsReadResponse = ApiResponse<{ count: number }>;
