import { db } from './lib/db';
import { Server } from './server';

let server: Server | null = null;

/**
 * Lazily builds the Hono API app. Kept behind a dynamic import boundary
 * (see src/routes/api/$.ts) so that db/auth/email modules never load during
 * prerendering or client builds.
 */
export function getApiServer(): Server {
	if (server) return server;

	if (!process.env.DATABASE_URL) {
		throw new Error('No valid DATABASE URL environment variable found');
	}

	if (!process.env.BETTER_AUTH_URL) {
		throw new Error('No valid AUTH credentials found in the environment');
	}

	if (!process.env.RESEND_API_KEY) {
		throw new Error('No valid RESEND API KEY environment variable found');
	}

	if (!process.env.EMAIL_FROM) {
		throw new Error('No valid EMAIL FROM environment variable found');
	}

	if (!process.env.FRONTEND_URL) {
		throw new Error('No valid FRONTEND URL environment variable found');
	}

	server = new Server({
		frontendUrl: process.env.FRONTEND_URL,
		db,
	});

	return server;
}
