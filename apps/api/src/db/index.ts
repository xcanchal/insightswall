import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from './schema.js';
import * as authSchema from './auth-schema.js';

console.log('DATABASE_URL_DIRECT', process.env.DATABASE_URL_DIRECT);
console.log('DATABASE_URL', process.env.DATABASE_URL);

if (!process.env.DATABASE_URL_DIRECT) {
	console.log('Using pooled database URL');
}

if (!process.env.DATABASE_URL) {
	throw new Error('DATABASE_URL is not set');
}

const dbUrl = process.env.DATABASE_URL_DIRECT ?? process.env.DATABASE_URL!;

export const db = drizzle(dbUrl, { schema: { ...schema, ...authSchema }, casing: 'snake_case' });
