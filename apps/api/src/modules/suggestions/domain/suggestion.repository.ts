import type { SuggestionCategory, SuggestionEntity } from './suggestion.entity.js';

export interface ISuggestionRepository {
	create(projectId: string, userId: string, description: string, category: SuggestionCategory): Promise<SuggestionEntity>;
	findAllByProjectId(projectId: string): Promise<SuggestionEntity[]>;
}
