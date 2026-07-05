import { createAuthClient } from 'better-auth/react';

// No baseURL: the auth server lives on the same origin as the app.
export const authClient = createAuthClient();

export const { signUp, signIn, useSession, signOut, deleteUser } = authClient;
