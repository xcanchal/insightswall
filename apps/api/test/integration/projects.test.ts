import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../../src/lib/auth.js', () => ({
	auth: {
		api: { getSession: vi.fn() },
		handler: vi.fn().mockResolvedValue(new Response('', { status: 200 })),
	},
}));

import { eq, sql } from 'drizzle-orm';
import { projectMembers, projects } from '../../src/lib/db/schema.js';
import { users } from '../../src/lib/db/auth-schema.js';
import { createTestDb, createTestServer, mockGetSession, TEST_USER, TEST_SESSION, TEST_HEADERS } from '../helpers.js';

describe('Projects', () => {
	let server: ReturnType<typeof createTestServer>;
	let db: Awaited<ReturnType<typeof createTestDb>>;

	beforeAll(async () => {
		db = await createTestDb();
		server = createTestServer(db);
	});

	beforeEach(async () => {
		mockGetSession.mockReset();
		await db.execute(sql`TRUNCATE TABLE users CASCADE`);
	});

	describe('POST /api/projects', () => {
		describe('Error cases', () => {
			it('returns 401 when not authenticated', async () => {
				mockGetSession.mockResolvedValue(null);

				const res = await server.request('/api/projects', {
					method: 'POST',
					headers: TEST_HEADERS,
					body: JSON.stringify({ name: 'My Project' }),
				});

				expect(res.status).toBe(401);
			});

			it('returns 400 when name is missing', async () => {
				mockGetSession.mockResolvedValue({ user: TEST_USER, session: TEST_SESSION });

				const res = await server.request('/api/projects', {
					method: 'POST',
					headers: TEST_HEADERS,
					body: JSON.stringify({}),
				});

				expect(res.status).toBe(400);
			});

			it('returns 400 when name is empty', async () => {
				mockGetSession.mockResolvedValue({ user: TEST_USER, session: TEST_SESSION });

				const res = await server.request('/api/projects', {
					method: 'POST',
					headers: TEST_HEADERS,
					body: JSON.stringify({ name: '' }),
				});

				expect(res.status).toBe(400);
			});

			it('returns 400 when name exceeds 50 characters', async () => {
				mockGetSession.mockResolvedValue({ user: TEST_USER, session: TEST_SESSION });

				const res = await server.request('/api/projects', {
					method: 'POST',
					headers: TEST_HEADERS,
					body: JSON.stringify({ name: 'a'.repeat(51) }),
				});

				expect(res.status).toBe(400);
			});

			it('returns 400 when url is not a valid URL', async () => {
				mockGetSession.mockResolvedValue({ user: TEST_USER, session: TEST_SESSION });

				const res = await server.request('/api/projects', {
					method: 'POST',
					headers: TEST_HEADERS,
					body: JSON.stringify({ name: 'My Project', url: 'not-a-url' }),
				});

				expect(res.status).toBe(400);
			});
		});

		describe('Success cases', () => {
			it('creates a project and returns 201', async () => {
				await db.insert(users).values(TEST_USER);
				mockGetSession.mockResolvedValue({ user: TEST_USER, session: TEST_SESSION });

				const res = await server.request('/api/projects', {
					method: 'POST',
					headers: TEST_HEADERS,
					body: JSON.stringify({ name: 'My Project' }),
				});

				expect(res.status).toBe(201);
				const body = await res.json();
				expect(body.name).toBe('My Project');
				expect(body.url).toBeNull();
				expect(body.id).toBeDefined();
				expect(body.createdAt).toBeDefined();
			});

			it('creates a project with a url and returns 201', async () => {
				await db.insert(users).values(TEST_USER);
				mockGetSession.mockResolvedValue({ user: TEST_USER, session: TEST_SESSION });

				const res = await server.request('/api/projects', {
					method: 'POST',
					headers: TEST_HEADERS,
					body: JSON.stringify({ name: 'My Project', url: 'https://example.com' }),
				});

				expect(res.status).toBe(201);
				const body = await res.json();
				expect(body.name).toBe('My Project');
				expect(body.url).toBe('https://example.com');
			});

			it('adds the creator as ADMIN member', async () => {
				await db.insert(users).values(TEST_USER);
				mockGetSession.mockResolvedValue({ user: TEST_USER, session: TEST_SESSION });

				const res = await server.request('/api/projects', {
					method: 'POST',
					headers: TEST_HEADERS,
					body: JSON.stringify({ name: 'My Project' }),
				});

				const body = await res.json();
				const [member] = await db.select().from(projectMembers).where(eq(projectMembers.projectId, body.id));
				expect(member.userId).toBe(TEST_USER.id);
				expect(member.role).toBe('ADMIN');
			});
		});
	});

	describe('GET /api/projects', () => {
		describe('Error cases', () => {
			it('returns 401 when not authenticated', async () => {
				mockGetSession.mockResolvedValue(null);

				const res = await server.request('/api/projects');

				expect(res.status).toBe(401);
			});
		});

		describe('Success cases', () => {
			it('returns empty array when user has no projects', async () => {
				await db.insert(users).values(TEST_USER);
				mockGetSession.mockResolvedValue({ user: TEST_USER, session: TEST_SESSION });

				const res = await server.request('/api/projects');

				expect(res.status).toBe(200);
				const body = await res.json();
				expect(body).toHaveLength(0);
			});

			it('returns only projects where the user is a member', async () => {
				await db.insert(users).values(TEST_USER);
				const [project1] = await db.insert(projects).values({ name: 'Project 1' }).returning();
				await db.insert(projects).values({ name: 'Project 2' });
				await db.insert(projectMembers).values({ projectId: project1.id, userId: TEST_USER.id, role: 'ADMIN' });

				mockGetSession.mockResolvedValue({ user: TEST_USER, session: TEST_SESSION });

				const res = await server.request('/api/projects');

				expect(res.status).toBe(200);
				const body = await res.json();
				expect(body).toHaveLength(1);
				expect(body[0].name).toBe('Project 1');
			});
		});
	});

	describe('GET /api/projects/:projectId', () => {
		describe('Error cases', () => {
			it('returns 400 when projectId is not a valid UUID', async () => {
				const res = await server.request('/api/projects/not-a-uuid');

				expect(res.status).toBe(400);
			});

			it('returns 404 when project does not exist', async () => {
				const res = await server.request(`/api/projects/${crypto.randomUUID()}`);

				expect(res.status).toBe(404);
			});
		});

		describe('Success cases', () => {
			it('returns the project without authentication', async () => {
				mockGetSession.mockResolvedValue(null);
				const [project] = await db.insert(projects).values({ name: 'Public Project' }).returning();

				const res = await server.request(`/api/projects/${project.id}`);

				expect(res.status).toBe(200);
				const body = await res.json();
				expect(body.id).toBe(project.id);
				expect(body.name).toBe('Public Project');
			});

			it('returns the project with authentication', async () => {
				await db.insert(users).values(TEST_USER);
				mockGetSession.mockResolvedValue({ user: TEST_USER, session: TEST_SESSION });
				const [project] = await db.insert(projects).values({ name: 'My Project' }).returning();

				const res = await server.request(`/api/projects/${project.id}`);

				expect(res.status).toBe(200);
				const body = await res.json();
				expect(body.id).toBe(project.id);
				expect(body.name).toBe('My Project');
				expect(body.createdAt).toBeDefined();
			});
		});
	});

	describe('PATCH /api/projects/:projectId', () => {
		describe('Error cases', () => {
			it('returns 401 when not authenticated', async () => {
				mockGetSession.mockResolvedValue(null);

				const res = await server.request(`/api/projects/${crypto.randomUUID()}`, {
					method: 'PATCH',
					headers: TEST_HEADERS,
					body: JSON.stringify({ name: 'Updated' }),
				});

				expect(res.status).toBe(401);
			});

			it('returns 403 when user is not a project admin', async () => {
				await db.insert(users).values(TEST_USER);
				const [project] = await db.insert(projects).values({ name: 'Test Project' }).returning();

				mockGetSession.mockResolvedValue({ user: TEST_USER, session: TEST_SESSION });

				const res = await server.request(`/api/projects/${project.id}`, {
					method: 'PATCH',
					headers: TEST_HEADERS,
					body: JSON.stringify({ name: 'Updated' }),
				});

				expect(res.status).toBe(403);
			});

			it('returns 400 when name is missing', async () => {
				await db.insert(users).values(TEST_USER);
				const [project] = await db.insert(projects).values({ name: 'Test Project' }).returning();
				await db.insert(projectMembers).values({ projectId: project.id, userId: TEST_USER.id, role: 'ADMIN' });

				mockGetSession.mockResolvedValue({ user: TEST_USER, session: TEST_SESSION });

				const res = await server.request(`/api/projects/${project.id}`, {
					method: 'PATCH',
					headers: TEST_HEADERS,
					body: JSON.stringify({}),
				});

				expect(res.status).toBe(400);
			});

			it('returns 400 when name is empty', async () => {
				await db.insert(users).values(TEST_USER);
				const [project] = await db.insert(projects).values({ name: 'Test Project' }).returning();
				await db.insert(projectMembers).values({ projectId: project.id, userId: TEST_USER.id, role: 'ADMIN' });

				mockGetSession.mockResolvedValue({ user: TEST_USER, session: TEST_SESSION });

				const res = await server.request(`/api/projects/${project.id}`, {
					method: 'PATCH',
					headers: TEST_HEADERS,
					body: JSON.stringify({ name: '' }),
				});

				expect(res.status).toBe(400);
			});

			it('returns 400 when name exceeds 50 characters', async () => {
				await db.insert(users).values(TEST_USER);
				const [project] = await db.insert(projects).values({ name: 'Test Project' }).returning();
				await db.insert(projectMembers).values({ projectId: project.id, userId: TEST_USER.id, role: 'ADMIN' });

				mockGetSession.mockResolvedValue({ user: TEST_USER, session: TEST_SESSION });

				const res = await server.request(`/api/projects/${project.id}`, {
					method: 'PATCH',
					headers: TEST_HEADERS,
					body: JSON.stringify({ name: 'a'.repeat(51) }),
				});

				expect(res.status).toBe(400);
			});

			it('returns 400 when url is not a valid URL', async () => {
				await db.insert(users).values(TEST_USER);
				const [project] = await db.insert(projects).values({ name: 'Test Project' }).returning();
				await db.insert(projectMembers).values({ projectId: project.id, userId: TEST_USER.id, role: 'ADMIN' });

				mockGetSession.mockResolvedValue({ user: TEST_USER, session: TEST_SESSION });

				const res = await server.request(`/api/projects/${project.id}`, {
					method: 'PATCH',
					headers: TEST_HEADERS,
					body: JSON.stringify({ name: 'Updated', url: 'not-a-url' }),
				});

				expect(res.status).toBe(400);
			});
		});

		describe('Success cases', () => {
			it('updates the project name and url and returns 200', async () => {
				await db.insert(users).values(TEST_USER);
				const [project] = await db.insert(projects).values({ name: 'Old Name', url: 'https://old.example.com' }).returning();
				await db.insert(projectMembers).values({ projectId: project.id, userId: TEST_USER.id, role: 'ADMIN' });

				mockGetSession.mockResolvedValue({ user: TEST_USER, session: TEST_SESSION });

				const res = await server.request(`/api/projects/${project.id}`, {
					method: 'PATCH',
					headers: TEST_HEADERS,
					body: JSON.stringify({ name: 'New Name', url: 'https://new.example.com' }),
				});

				expect(res.status).toBe(200);
				const body = await res.json();
				expect(body.name).toBe('New Name');
				expect(body.url).toBe('https://new.example.com');
				expect(body.id).toBe(project.id);
			});

			it('clears the project url when null is provided', async () => {
				await db.insert(users).values(TEST_USER);
				const [project] = await db.insert(projects).values({ name: 'Old Name', url: 'https://old.example.com' }).returning();
				await db.insert(projectMembers).values({ projectId: project.id, userId: TEST_USER.id, role: 'ADMIN' });

				mockGetSession.mockResolvedValue({ user: TEST_USER, session: TEST_SESSION });

				const res = await server.request(`/api/projects/${project.id}`, {
					method: 'PATCH',
					headers: TEST_HEADERS,
					body: JSON.stringify({ name: 'Old Name', url: null }),
				});

				expect(res.status).toBe(200);
				const body = await res.json();
				expect(body.url).toBeNull();
			});
		});
	});

	describe('DELETE /api/projects/:projectId', () => {
		describe('Error cases', () => {
			it('returns 401 when not authenticated', async () => {
				mockGetSession.mockResolvedValue(null);

				const res = await server.request(`/api/projects/${crypto.randomUUID()}`, {
					method: 'DELETE',
					headers: TEST_HEADERS,
				});

				expect(res.status).toBe(401);
			});

			it('returns 403 when user is not a project admin', async () => {
				await db.insert(users).values(TEST_USER);
				const [project] = await db.insert(projects).values({ name: 'Test Project' }).returning();

				mockGetSession.mockResolvedValue({ user: TEST_USER, session: TEST_SESSION });

				const res = await server.request(`/api/projects/${project.id}`, {
					method: 'DELETE',
					headers: TEST_HEADERS,
				});

				expect(res.status).toBe(403);
			});
		});

		describe('Success cases', () => {
			it('deletes the project and returns 204', async () => {
				await db.insert(users).values(TEST_USER);
				const [project] = await db.insert(projects).values({ name: 'To Delete' }).returning();
				await db.insert(projectMembers).values({ projectId: project.id, userId: TEST_USER.id, role: 'ADMIN' });

				mockGetSession.mockResolvedValue({ user: TEST_USER, session: TEST_SESSION });

				const res = await server.request(`/api/projects/${project.id}`, {
					method: 'DELETE',
					headers: TEST_HEADERS,
				});

				expect(res.status).toBe(204);

				const [row] = await db.select().from(projects).where(eq(projects.id, project.id));
				expect(row).toBeUndefined();
			});
		});
	});
});
