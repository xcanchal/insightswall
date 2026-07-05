import { vi } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { drizzle } from 'drizzle-orm/pglite';
import { migrate } from 'drizzle-orm/pglite/migrator';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as schema from '../src/server/lib/db/schema';
import * as authSchema from '../src/server/lib/db/auth-schema';
import { Server } from '../src/server/server';
import { auth } from '../src/server/lib/auth';
import type { Session, User } from 'better-auth';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function createTestDb() {
	const client = new PGlite();
	const db = drizzle(client, {
		schema: { ...schema, ...authSchema },
		casing: 'snake_case',
	});
	await migrate(db, {
		migrationsFolder: path.resolve(__dirname, '../drizzle'),
	});
	return db;
}

export function createTestServer(db: ReturnType<typeof drizzle>) {
	return new Server({
		frontendUrl: 'http://localhost:5173',
		db,
	});
}

export const TEST_USER: User = {
	id: crypto.randomUUID(),
	name: 'Test User',
	email: 'test@example.com',
	emailVerified: true as const,
	image: null,
	createdAt: new Date(),
	updatedAt: new Date(),
};

export const TEST_SESSION = { id: crypto.randomUUID(), token: 'test-token' } as Session;

export const TEST_HEADERS = {
	'Content-Type': 'application/json',
};

export const mockGetSession = vi.mocked(auth.api.getSession);
