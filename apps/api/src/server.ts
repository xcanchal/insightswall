import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { serve } from '@hono/node-server';
import { auth } from './auth.js';
import { cors } from 'hono/cors';
import { UserRepository } from './modules/users/infrastructure/user.repository.impl.js';
import { db } from './db/index.js';
import { GetUserRoute } from './modules/users/presentation/routes/get-user.route.js';
import { GetUserUseCase } from './modules/users/application/use-cases/get-user.use-case.js';

export type ServerConfig = {
	port: number;
	drizzle: {
		uri: string;
	};
	frontendUrl: string;
};

export class Server {
	config: ServerConfig;
	private app: Hono;
	private userRepository: UserRepository | null = null;

	constructor(config: ServerConfig) {
		this.config = config;
		this.app = new Hono();
		this.configureMiddlewares();
		this.configureRepositories();
		this.configureRoutes();
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

		this.userRepository = new UserRepository(db); // User, Session...
		/* const projectRepository = new ProjectRepository(db); // Project, ProjectMember
		const suggestionRepository = new SuggestionRepository(db); // Suggestion, Vote, Comment
    

		const roadmapRepository = new RoadmapRepository(db); // Roadmap, RoadmapItem
		const notificationRepository = new NotificationRepository(db); // Notification */
	}

	configureRoutes() {
		// Auth (Managed by Better Auth)
		this.app.on(['GET', 'POST'], '/api/auth/**', (c) => auth.handler(c.req.raw));

		// Module routers
		this.configureUserRoutes();
		/* this.app.route('/api/users', userRouter); */
		/* this.app.route('/api/suggestions', suggestionRouter); */
		/* this.app.route('/api/roadmap', roadmapRouter); */
		/* this.app.route('/api/notifications', notificationRouter); */

		// Health check
		this.app.get('/health', (c) => c.json({ status: 'ok' }));
	}

	configureUserRoutes() {
		if (!this.userRepository) throw new Error('User repository not configured');

		const getUserRoute = new GetUserRoute(this.app, new GetUserUseCase(this.userRepository));
		this.app.route(getUserRoute.routePath, getUserRoute.route());

		// TODO: Other routes
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
