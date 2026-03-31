import type { Project } from '../domain/projects.ts';
import type { ApiResponse } from './common.ts';

export type GetProjectsResponse = ApiResponse<Project[]>;
export type GetProjectResponse = ApiResponse<Project>;

export interface CreateProjectRequest {
	name: string;
}
export type CreateProjectResponse = ApiResponse<Project>;

export interface UpdateProjectRequest {
	name?: string;
}
export type UpdateProjectResponse = ApiResponse<Project>;
