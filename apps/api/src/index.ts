import { Server } from './server.js';
import { db } from './lib/db/index.js';

(async () => {
	try {
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

		const server = new Server({
			port: Number(process.env.PORT) || 3000,
			frontendUrl: process.env.FRONTEND_URL,
			db,
		});

		server.start();
	} catch (error) {
		console.error(error);
		process.exit(1);
	}
})();
