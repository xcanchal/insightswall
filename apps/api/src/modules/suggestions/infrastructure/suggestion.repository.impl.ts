import { db as dbInstance } from '../../../lib/db/index.js';
import { suggestions } from '../../../lib/db/schema.js';
import { toSuggestion } from './suggestion.mapper.js';
import type { SuggestionCategory, SuggestionEntity } from '../domain/suggestion.entity.js';
import { ISuggestionRepository } from '../domain/suggestion.repository.js';
import { eq } from 'drizzle-orm';

export class SuggestionRepository implements ISuggestionRepository {
	private db: typeof dbInstance;

	constructor(db: typeof dbInstance) {
		this.db = db;
	}

	async create(projectId: string, userId: string, description: string, category: SuggestionCategory): Promise<SuggestionEntity> {
		const [suggestion] = await this.db.insert(suggestions).values({ projectId, userId, description, category }).returning();
		return toSuggestion(suggestion);
	}

	async findAllByProjectId(projectId: string): Promise<SuggestionEntity[]> {
		const rows = await this.db.select().from(suggestions).where(eq(suggestions.projectId, projectId));
		return rows.map(toSuggestion);
	}
}
