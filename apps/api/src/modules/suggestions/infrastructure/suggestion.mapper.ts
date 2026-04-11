import type { InferSelectModel } from 'drizzle-orm';
import { suggestions } from '../../../lib/db/schema.js';
import type { SuggestionEntity } from '../domain/suggestion.entity.js';

type SuggestionRow = InferSelectModel<typeof suggestions>;

export function toSuggestion(row: SuggestionRow): SuggestionEntity {
	return {
		id: row.id,
		projectId: row.projectId,
		userId: row.userId,
		description: row.description,
		category: row.category,
		status: row.status,
		createdAt: row.createdAt,
		updatedAt: row.updatedAt,
	};
}
