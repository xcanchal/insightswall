import { OpenAPIHono } from '@hono/zod-openapi';
import { swaggerUI } from '@hono/swagger-ui';
import { logger } from 'hono/logger';
import { serve } from '@hono/node-server';
import { auth, type AuthVariables } from './lib/auth.js';
import { cors } from 'hono/cors';
import { ProjectRepository } from './modules/projects/infrastructure/project.repository.impl.js';
import { db } from './lib/db/index.js';
import { CreateProjectRoute } from './modules/projects/presentation/routes/create-project.route.js';
import { CreateProjectUseCase } from './modules/projects/application/use-cases/create-project.use-case.js';
import { GetProjectsRoute } from './modules/projects/presentation/routes/get-projects.route.js';
import { GetProjectsUseCase } from './modules/projects/application/use-cases/get-projects.use-case.js';

export type ServerConfig = {
	port: number;
	drizzle: {
		uri: string;
	};
	frontendUrl: string;
};

export class Server {
	config: ServerConfig;
	private app: OpenAPIHono<{ Variables: AuthVariables }>;
	private projectRepository: ProjectRepository | null = null;

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

		this.projectRepository = new ProjectRepository(db);
		/* const suggestionRepository = new SuggestionRepository(db); // Suggestion, Vote, Comment
		const roadmapRepository = new RoadmapRepository(db); // Roadmap, RoadmapItem
		const notificationRepository = new NotificationRepository(db); // Notification */
	}

	configureRoutes() {
		// Auth (Managed by Better Auth)
		this.app.on(['GET', 'POST'], '/api/auth/**', (c) => auth.handler(c.req.raw));

		// Module routers
		this.configureProjectRoutes();
		/* this.app.route('/api/suggestions', suggestionRouter); */
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
		new GetProjectsRoute(this.app, new GetProjectsUseCase(this.projectRepository)).route();
		new CreateProjectRoute(this.app, new CreateProjectUseCase(this.projectRepository)).route();
	}

	/*  configureSuggestionEndpoints() {
        const getSuggestionRoute = new GetSuggestionRoute(this.app, new GetSuggestionUseCase(this.suggestionRepository));
        this.app.route(getSuggestionRoute.route());
    } */

	start() {
		serve({ fetch: this.app.fetch, port: this.config.port }, () => {
			console.log(`Server running on http://localhost:${this.config.port}`);
		});
	}
}
