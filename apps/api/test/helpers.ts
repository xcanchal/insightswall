import { PGlite } from '@electric-sql/pglite';
import { drizzle } from 'drizzle-orm/pglite';
import { migrate } from 'drizzle-orm/pglite/migrator';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as schema from '../src/lib/db/schema.js';
import * as authSchema from '../src/lib/db/auth-schema.js';
import { Server } from '../src/server.js';

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
		port: 0,
		frontendUrl: 'http://localhost:5173',
		db,
	});
}
