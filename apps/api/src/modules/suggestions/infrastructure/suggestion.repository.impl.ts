import { and, desc, eq, inArray, sql } from 'drizzle-orm';
import { db as dbInstance } from '../../../lib/db/index.js';
import { suggestions, votes } from '../../../lib/db/schema.js';
import { toSuggestion } from './suggestion.mapper.js';
import type { SuggestionCategory, SuggestionEntity } from '../domain/suggestion.entity.js';
import type {
	ISuggestionRepository,
	SuggestionFilters,
	SuggestionSortBy,
	SuggestionWithVoteContext,
} from '../domain/suggestion.repository.js';

export class SuggestionRepository implements ISuggestionRepository {
	private db: typeof dbInstance;

	constructor(db: typeof dbInstance) {
		this.db = db;
	}

	async create(projectId: string, userId: string, description: string, category: SuggestionCategory): Promise<SuggestionEntity> {
		const [suggestion] = await this.db.insert(suggestions).values({ projectId, userId, description, category }).returning();
		return toSuggestion(suggestion);
	}

	async findAllByProjectId(
		projectId: string,
		userId: string | null,
		sortBy: SuggestionSortBy,
		filters?: SuggestionFilters
	): Promise<SuggestionWithVoteContext[]> {
		const voteCount = sql<number>`COUNT(${votes.userId})`;
		const conditions = [
			eq(suggestions.projectId, projectId),
			...(filters?.categories?.length ? [inArray(suggestions.category, filters.categories)] : []),
			...(filters?.statuses?.length ? [inArray(suggestions.status, filters.statuses)] : []),
		];
		const rows = await this.db
			.select({
				suggestion: suggestions,
				voteCount,
				userHasVoted: userId ? sql<boolean>`COALESCE(BOOL_OR(${votes.userId} = ${userId}), false)` : sql<boolean>`false`,
			})
			.from(suggestions)
			.leftJoin(votes, eq(votes.suggestionId, suggestions.id))
			.where(and(...conditions))
			.groupBy(suggestions.id)
			.orderBy(sortBy === 'newest' ? desc(suggestions.createdAt) : desc(voteCount));

		return rows.map(({ suggestion, voteCount, userHasVoted }) => ({
			suggestion: toSuggestion(suggestion),
			voteCount: Number(voteCount),
			userHasVoted,
		}));
	}

	async vote(suggestionId: string, userId: string): Promise<void> {
		await this.db.insert(votes).values({ suggestionId, userId });
	}

	async unvote(suggestionId: string, userId: string): Promise<void> {
		await this.db.delete(votes).where(and(eq(votes.suggestionId, suggestionId), eq(votes.userId, userId)));
	}
}
