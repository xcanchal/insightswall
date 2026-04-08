import { createAuthClient } from 'better-auth/react';

if (!import.meta.env.VITE_BETTER_AUTH_URL) {
	throw new Error('No valid BETTER AUTH URL environment variable found');
}

export const authClient = createAuthClient({
	baseURL: import.meta.env.VITE_BETTER_AUTH_URL,
});

export const { signUp, signIn, useSession, signOut } = authClient;
