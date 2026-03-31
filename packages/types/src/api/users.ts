import type { User } from '../domain/users.ts';
import type { ApiResponse } from './common.ts';

export type GetUsersResponse = ApiResponse<User[]>;
export type GetUserResponse = ApiResponse<User>;

export interface CreateUserRequest {
	email: string;
}
export type CreateUserResponse = ApiResponse<User>;
