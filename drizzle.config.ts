import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	out: './drizzle',
	schema: ['./src/server/lib/db/schema.ts', './src/server/lib/db/auth-schema.ts'],
	dialect: 'postgresql',
	casing: 'snake_case',
	dbCredentials: {
		url: process.env.DATABASE_URL!,
	},
});
