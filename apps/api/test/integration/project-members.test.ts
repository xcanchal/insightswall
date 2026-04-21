import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../../src/lib/auth.js', () => ({
	auth: {
		api: { getSession: vi.fn() },
		handler: vi.fn().mockResolvedValue(new Response('', { status: 200 })),
	},
}));

import { sql } from 'drizzle-orm';
import { projectMembers, projects } from '../../src/lib/db/schema.js';
import { users } from '../../src/lib/db/auth-schema.js';
import { createTestDb, createTestServer, mockGetSession, TEST_USER, TEST_SESSION } from '../helpers.js';

describe('Project Members', () => {
	let server: ReturnType<typeof createTestServer>;
	let db: Awaited<ReturnType<typeof createTestDb>>;

	beforeAll(async () => {
		db = await createTestDb();
		server = createTestServer(db);
	});

	beforeEach(async () => {
		mockGetSession.mockReset();
		await db.execute(sql`TRUNCATE TABLE users, projects CASCADE`);
	});

	describe('GET /api/projects/:projectId/me', () => {
		describe('Error cases', () => {
			it('returns 401 when not authenticated', async () => {
				mockGetSession.mockResolvedValue(null);

				const res = await server.request(`/api/projects/${crypto.randomUUID()}/me`);

				expect(res.status).toBe(401);
			});

			it('returns 400 when projectId is not a valid UUID', async () => {
				await db.insert(users).values(TEST_USER);
				mockGetSession.mockResolvedValue({ user: TEST_USER, session: TEST_SESSION });

				const res = await server.request('/api/projects/not-a-uuid/me');

				expect(res.status).toBe(400);
			});

			it('returns 404 when user is not a member of the project', async () => {
				await db.insert(users).values(TEST_USER);
				const [project] = await db.insert(projects).values({ name: 'Test Project' }).returning();

				mockGetSession.mockResolvedValue({ user: TEST_USER, session: TEST_SESSION });

				const res = await server.request(`/api/projects/${project.id}/me`);

				expect(res.status).toBe(404);
			});
		});

		describe('Success cases', () => {
			it('returns the project member and returns 200', async () => {
				await db.insert(users).values(TEST_USER);
				const [project] = await db.insert(projects).values({ name: 'Test Project' }).returning();
				await db.insert(projectMembers).values({ projectId: project.id, userId: TEST_USER.id, role: 'ADMIN' });

				mockGetSession.mockResolvedValue({ user: TEST_USER, session: TEST_SESSION });

				const res = await server.request(`/api/projects/${project.id}/me`);

				expect(res.status).toBe(200);
				const body = await res.json();
				expect(body.projectId).toBe(project.id);
				expect(body.userId).toBe(TEST_USER.id);
				expect(body.role).toBe('ADMIN');
			});
		});
	});
});
