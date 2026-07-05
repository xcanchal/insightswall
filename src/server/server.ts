import { OpenAPIHono } from '@hono/zod-openapi';
import { swaggerUI } from '@hono/swagger-ui';
import { logger } from 'hono/logger';
import { auth, type AuthVariables } from './lib/auth';
import { cors } from 'hono/cors';
import { ProjectRepository } from './modules/projects/infrastructure/project/project.repository.impl';
import { ProjectMemberRepository } from './modules/projects/infrastructure/project-member/project-member.repository.impl';
import { SuggestionRepository } from './modules/suggestions/infrastructure/suggestion.repository.impl';
import { CreateProjectRoute } from './modules/projects/presentation/routes/project/create-project.route';
import { CreateProjectUseCase } from './modules/projects/application/use-cases/project/create-project.use-case';
import { GetProjectsRoute } from './modules/projects/presentation/routes/project/get-projects.route';
import { GetProjectsUseCase } from './modules/projects/application/use-cases/project/get-projects.use-case';
import { GetProjectRoute } from './modules/projects/presentation/routes/project/get-project.route';
import { GetProjectUseCase } from './modules/projects/application/use-cases/project/get-project.use-case';
import { CreateSuggestionRoute } from './modules/suggestions/presentation/routes/create-suggestion.route';
import { CreateSuggestionUseCase } from './modules/suggestions/application/use-cases/create-suggestion.use-case';
import { GetSuggestionsRoute } from './modules/suggestions/presentation/routes/get-suggestions.route';
import { GetSuggestionsUseCase } from './modules/suggestions/application/use-cases/get-suggestions.use-case';
import { GetProjectMemberRoute } from './modules/projects/presentation/routes/project-member/get-project-member.route';
import { GetProjectMemberUseCase } from './modules/projects/application/use-cases/project-member/get-project-member.use-case';
import { UpdateProjectRoute } from './modules/projects/presentation/routes/project/update-project.route';
import { UpdateProjectUseCase } from './modules/projects/application/use-cases/project/update-project.use-case';
import { DeleteProjectRoute } from './modules/projects/presentation/routes/project/delete-project.route';
import { DeleteProjectUseCase } from './modules/projects/application/use-cases/project/delete-project.use-case';
import { VoteSuggestionRoute } from './modules/suggestions/presentation/routes/vote-suggestion.route';
import { VoteSuggestionUseCase } from './modules/suggestions/application/use-cases/vote-suggestion.use-case';
import { UnvoteSuggestionRoute } from './modules/suggestions/presentation/routes/unvote-suggestion.route';
import { UnvoteSuggestionUseCase } from './modules/suggestions/application/use-cases/unvote-suggestion.use-case';
import { UpdateSuggestionStatusRoute } from './modules/suggestions/presentation/routes/update-suggestion-status.route';
import { UpdateSuggestionStatusUseCase } from './modules/suggestions/application/use-cases/update-suggestion-status.use-case';
import { DeleteSuggestionRoute } from './modules/suggestions/presentation/routes/delete-suggestion.route';
import { DeleteSuggestionUseCase } from './modules/suggestions/application/use-cases/delete-suggestion.use-case';
import { EditSuggestionRoute } from './modules/suggestions/presentation/routes/edit-suggestion.route';
import { EditSuggestionUseCase } from './modules/suggestions/application/use-cases/edit-suggestion.use-case';

export type ServerConfig = {
	frontendUrl: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	db: any;
};

export class Server {
	config: ServerConfig;
	private app: OpenAPIHono<{ Variables: AuthVariables }>;
	private projectRepository: ProjectRepository | null = null;
	private projectMemberRepository: ProjectMemberRepository | null = null;
	private suggestionRepository: SuggestionRepository | null = null;

	constructor(config: ServerConfig) {
		this.config = config;
		this.app = new OpenAPIHono<{ Variables: AuthVariables }>();
		this.configureMiddlewares();
		this.configureRepositories();
		this.configureRoutes();
		this.configureApiDocs();
	}

	configureMiddlewares() {
		this.app.use(logger());
		this.app.use(
			cors({
				origin: this.config.frontendUrl,
				allowHeaders: ['Content-Type', 'Authorization'],
				allowMethods: ['GET', 'POST', 'PATCH', 'DELETE'],
				credentials: true,
			})
		);
	}

	configureRepositories() {
		/* Aggregate Root — the only entry point to a cluster of entities. Never bypass it to modify children directly.
        // WRONG: update vote table directly
        // RIGHT: suggestionRepo.addVote(suggestionId, userId)
          Repository — abstracts persistence. Only aggregate roots get one. Returns domain objects, not DB rows. */

		this.projectRepository = new ProjectRepository(this.config.db);
		this.projectMemberRepository = new ProjectMemberRepository(this.config.db);
		this.suggestionRepository = new SuggestionRepository(this.config.db); // Suggestion, Vote, Comment
		/*  
		const roadmapRepository = new RoadmapRepository(db); // Roadmap, RoadmapItem
		const notificationRepository = new NotificationRepository(db); // Notification */
	}

	configureRoutes() {
		// Auth (Managed by Better Auth)
		this.app.on(['GET', 'POST'], '/api/auth/**', (c) => auth.handler(c.req.raw));

		// Module routers
		this.configureProjectRoutes();
		this.configureProjectMemberRoutes();
		this.configureSuggestionRoutes();
		/* this.app.route('/api/roadmap', roadmapRouter); */
		/* this.app.route('/api/notifications', notificationRouter); */

		// Health check
		this.app.get('/health', (c) => c.json({ status: 'ok' }));
	}

	configureApiDocs() {
		// OpenAPI spec + Swagger UI
		this.app.doc('/openapi.json', {
			openapi: '3.0.0',
			info: { title: 'InsightsWall API', version: '1.0.0' },
		});
		this.app.get('/docs', swaggerUI({ url: '/openapi.json' }));
	}

	configureProjectRoutes() {
		if (!this.projectRepository) throw new Error('Project repository not configured');
		if (!this.projectMemberRepository) throw new Error('Project member repository not configured');
		new GetProjectsRoute(this.app, new GetProjectsUseCase(this.projectRepository)).route();
		new GetProjectRoute(this.app, new GetProjectUseCase(this.projectRepository)).route();
		new CreateProjectRoute(this.app, new CreateProjectUseCase(this.projectRepository)).route();
		new UpdateProjectRoute(this.app, new UpdateProjectUseCase(this.projectRepository), this.projectMemberRepository).route();
		new DeleteProjectRoute(this.app, new DeleteProjectUseCase(this.projectRepository), this.projectMemberRepository).route();
	}

	configureProjectMemberRoutes() {
		if (!this.projectMemberRepository) throw new Error('Project member repository not configured');
		new GetProjectMemberRoute(this.app, new GetProjectMemberUseCase(this.projectMemberRepository)).route();
	}

	configureSuggestionRoutes() {
		if (!this.suggestionRepository) throw new Error('Suggestion repository not configured');
		if (!this.projectMemberRepository) throw new Error('Project member repository not configured');
		new CreateSuggestionRoute(this.app, new CreateSuggestionUseCase(this.suggestionRepository, this.projectRepository!)).route();
		new GetSuggestionsRoute(this.app, new GetSuggestionsUseCase(this.suggestionRepository, this.projectRepository!)).route();
		new VoteSuggestionRoute(this.app, new VoteSuggestionUseCase(this.suggestionRepository)).route();
		new UnvoteSuggestionRoute(this.app, new UnvoteSuggestionUseCase(this.suggestionRepository)).route();
		new UpdateSuggestionStatusRoute(
			this.app,
			new UpdateSuggestionStatusUseCase(this.suggestionRepository),
			this.projectMemberRepository
		).route();
		new DeleteSuggestionRoute(this.app, new DeleteSuggestionUseCase(this.suggestionRepository, this.projectMemberRepository)).route();
		new EditSuggestionRoute(this.app, new EditSuggestionUseCase(this.suggestionRepository)).route();
	}

	get request() {
		return this.app.request.bind(this.app);
	}

	get fetch() {
		return this.app.fetch.bind(this.app);
	}
}
