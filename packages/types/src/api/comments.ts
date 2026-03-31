import type { Comment } from '../domain/comments.ts';
import type { ApiResponse } from './common.ts';

export type GetCommentsResponse = ApiResponse<Comment[]>;

export interface CreateCommentRequest {
	message: string;
}
export type CreateCommentResponse = ApiResponse<Comment>;
