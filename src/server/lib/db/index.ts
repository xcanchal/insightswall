import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from './schema';
import * as authSchema from './auth-schema';

const dbUrl = process.env.DATABASE_URL!;

export const db = drizzle(dbUrl, { schema: { ...schema, ...authSchema }, casing: 'snake_case' });
