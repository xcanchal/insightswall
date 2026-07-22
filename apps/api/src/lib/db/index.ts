import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from './schema.js';
import * as authSchema from './auth-schema.js';
import * as productContextSchema from './product-context-schema.js';

const dbUrl = process.env.DATABASE_URL!;

export const db = drizzle(dbUrl, { schema: { ...schema, ...authSchema, ...productContextSchema }, casing: 'snake_case' });
