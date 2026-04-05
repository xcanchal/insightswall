import { createAuthClient } from 'better-auth/react';

export const { signUp, signIn, useSession, signOut } = createAuthClient({
	/** The base URL of the server (optional if you're using the same domain) */
	baseURL: 'http://localhost:3000',
	fetchOptions: {
		credentials: 'include',
	},
});
