import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from './db/index.js';
import { sendEmail } from './email.js';

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: 'pg',
		usePlural: true,
	}),
	emailAndPassword: {
		enabled: true,
		requireEmailVerification: true,
	},
	emailVerification: {
		sendVerificationEmail: async ({ user, url /* , token */ } /* , request */) => {
			void sendEmail({
				to: user.email,
				subject: 'Verify your email address',
				text: `Click the link to verify your email: ${url}`,
			});
		},
	},
	trustedOrigins: [process.env.FRONTEND_URL!],
	advanced: {
		crossSubDomainCookies: { enabled: process.env.NODE_ENV !== 'production' },
		defaultCookieAttributes: {
			sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
			secure: process.env.NODE_ENV === 'production',
		},
	},
});

export type AuthVariables = {
	user: typeof auth.$Infer.Session.user | null;
	session: typeof auth.$Infer.Session.session | null;
};
