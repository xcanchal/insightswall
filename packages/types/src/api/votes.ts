import type { Vote } from '../domain/votes.ts';
import type { ApiResponse } from './common.ts';

export type GetVotesResponse = ApiResponse<Vote[]>;
export type ToggleVoteResponse = ApiResponse<{ voted: boolean }>;
