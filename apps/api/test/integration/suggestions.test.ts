import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../../src/lib/auth.js', () => ({
	auth: {
		api: { getSession: vi.fn() },
		handler: vi.fn().mockResolvedValue(new Response('', { status: 200 })),
	},
}));

import { sql } from 'drizzle-orm';
import { projectMembers, projects, suggestions, votes } from '../../src/lib/db/schema.js';
import { users } from '../../src/lib/db/auth-schema.js';
import { createTestDb, createTestServer, mockGetSession, TEST_USER, TEST_SESSION, TEST_HEADERS } from '../helpers.js';
import type { User } from 'better-auth';
import type { SuggestionEntity } from '../../src/modules/suggestions/domain/suggestion.entity.js';
import type { ProjectEntity } from '../../src/modules/projects/domain/project/project.entity.js';

describe('Suggestions', () => {
	let server: ReturnType<typeof createTestServer>;
	let db: Awaited<ReturnType<typeof createTestDb>>;

	let user1: User;
	let user2: User;
	let project: ProjectEntity;
	let suggestion1: SuggestionEntity;
	let suggestion2: SuggestionEntity;
	let suggestion3: SuggestionEntity;

	beforeAll(async () => {
		db = await createTestDb();
		server = createTestServer(db);
	});

	beforeEach(async () => {
		mockGetSession.mockReset();
		await db.execute(sql`TRUNCATE TABLE users CASCADE`);
	});

	describe('POST /api/suggestions', () => {
		describe('Error cases', () => {
			it('returns 401 when not authenticated', async () => {
				mockGetSession.mockResolvedValue(null);

				const res = await server.request('/api/suggestions', {
					method: 'POST',
					headers: TEST_HEADERS,
					body: JSON.stringify({
						projectId: crypto.randomUUID(),
						description: 'Dark mode',
						category: 'FEATURE',
					}),
				});

				expect(res.status).toBe(401);
			});

			it('returns 400 when projectId is not a valid UUID', async () => {
				mockGetSession.mockResolvedValue({ user: TEST_USER, session: TEST_SESSION });

				const res = await server.request('/api/suggestions', {
					method: 'POST',
					headers: TEST_HEADERS,
					body: JSON.stringify({ projectId: 'not-a-uuid', description: 'Dark mode', category: 'FEATURE' }),
				});

				expect(res.status).toBe(400);
			});

			it('returns 400 when projectId is missing', async () => {
				mockGetSession.mockResolvedValue({ user: TEST_USER, session: TEST_SESSION });

				const res = await server.request('/api/suggestions', {
					method: 'POST',
					headers: TEST_HEADERS,
					body: JSON.stringify({ description: 'Dark mode', category: 'FEATURE' }),
				});

				expect(res.status).toBe(400);
			});

			it('returns 400 when description is missing', async () => {
				mockGetSession.mockResolvedValue({ user: TEST_USER, session: TEST_SESSION });

				const res = await server.request('/api/suggestions', {
					method: 'POST',
					headers: TEST_HEADERS,
					body: JSON.stringify({ projectId: crypto.randomUUID(), category: 'FEATURE' }),
				});

				expect(res.status).toBe(400);
			});

			it('returns 400 when category is missing', async () => {
				mockGetSession.mockResolvedValue({ user: TEST_USER, session: TEST_SESSION });

				const res = await server.request('/api/suggestions', {
					method: 'POST',
					headers: TEST_HEADERS,
					body: JSON.stringify({ projectId: crypto.randomUUID(), description: 'Dark mode' }),
				});

				expect(res.status).toBe(400);
			});

			it('returns 400 when category is invalid', async () => {
				mockGetSession.mockResolvedValue({ user: TEST_USER, session: TEST_SESSION });

				const res = await server.request('/api/suggestions', {
					method: 'POST',
					headers: TEST_HEADERS,
					body: JSON.stringify({ projectId: crypto.randomUUID(), description: 'Dark mode', category: 'INVALID' }),
				});

				expect(res.status).toBe(400);
			});

			it('returns 404 when project does not exist', async () => {
				await db.insert(users).values(TEST_USER);
				mockGetSession.mockResolvedValue({ user: TEST_USER, session: TEST_SESSION });

				const res = await server.request('/api/suggestions', {
					method: 'POST',
					headers: TEST_HEADERS,
					body: JSON.stringify({
						projectId: crypto.randomUUID(),
						description: 'Dark mode',
						category: 'FEATURE',
					}),
				});

				expect(res.status).toBe(404);
			});
		});

		describe('Success cases', () => {
			it('creates a suggestion and returns 201', async () => {
				await db.insert(users).values(TEST_USER);
				const [project] = await db.insert(projects).values({ name: 'Test Project' }).returning();

				mockGetSession.mockResolvedValue({ user: TEST_USER, session: TEST_SESSION });

				const res = await server.request('/api/suggestions', {
					method: 'POST',
					headers: TEST_HEADERS,
					body: JSON.stringify({
						projectId: project.id,
						description: 'Dark mode please',
						category: 'FEATURE',
					}),
				});

				expect(res.status).toBe(201);
				const body = await res.json();
				expect(body.description).toBe('Dark mode please');
				expect(body.category).toBe('FEATURE');
				expect(body.status).toBe('OPEN');
			});
		});
	});

	describe('GET /api/projects/:projectId/suggestions', () => {
		beforeEach(async () => {
			await db.execute(sql`TRUNCATE TABLE users CASCADE`);
			await db.execute(sql`TRUNCATE TABLE projects CASCADE`);

			[user1] = await db.insert(users).values(TEST_USER).returning();
			[user2] = await db
				.insert(users)
				.values({ id: crypto.randomUUID(), name: 'User 2', email: 'user2@example.com', emailVerified: true, image: null })
				.returning();
			[project] = await db.insert(projects).values({ name: 'Test Project' }).returning();
			[suggestion1] = await db
				.insert(suggestions)
				.values({
					projectId: project.id,
					userId: user1.id,
					description: 'Bug 1',
					category: 'BUG',
					createdAt: new Date('2026-01-01'),
					status: 'OPEN',
				})
				.returning();
			[suggestion2] = await db
				.insert(suggestions)
				.values({
					projectId: project.id,
					userId: user1.id,
					description: 'Feature 1',
					category: 'FEATURE',
					createdAt: new Date('2026-01-02'),
					status: 'IN_PROGRESS',
				})
				.returning();
			[suggestion3] = await db
				.insert(suggestions)
				.values({
					projectId: project.id,
					userId: user1.id,
					description: 'Feature 2',
					category: 'FEATURE',
					createdAt: new Date('2026-01-03'),
					status: 'PLANNED',
				})
				.returning();

			// suggestion1: 2 votes, suggestion2: 1 vote, suggestion3: 0 votes
			await db.insert(votes).values({ userId: user1.id, suggestionId: suggestion1.id });
			await db.insert(votes).values({ userId: user2.id, suggestionId: suggestion1.id });
			await db.insert(votes).values({ userId: user1.id, suggestionId: suggestion2.id });
		});

		describe('Error cases', () => {
			it('returns 400 when projectId is not a valid UUID', async () => {
				const res = await server.request('/api/projects/not-a-uuid/suggestions');
				expect(res.status).toBe(400);
			});

			it('returns 404 when project does not exist', async () => {
				const res = await server.request(`/api/projects/${crypto.randomUUID()}/suggestions`);
				expect(res.status).toBe(404);
			});
		});

		describe('Success cases', () => {
			it('returns empty array when project has no suggestions', async () => {
				const [project] = await db.insert(projects).values({ name: 'Empty Project' }).returning();

				const res = await server.request(`/api/projects/${project.id}/suggestions`);

				expect(res.status).toBe(200);
				const body = await res.json();
				expect(body).toHaveLength(0);
			});

			it('returns suggestions with vote context', async () => {
				const res = await server.request(`/api/projects/${project.id}/suggestions`);
				const body = await res.json();
				expect(body).toHaveLength(3);
				expect(body[0]).toEqual({
					voteCount: 2,
					userHasVoted: false,
					id: suggestion1.id,
					projectId: project.id,
					userId: user1.id,
					description: 'Bug 1',
					category: 'BUG',
					createdAt: suggestion1.createdAt.toISOString(),
					status: 'OPEN',
					rejectionReason: null,
					updatedAt: null,
				});
				expect(body[1].id).toBe(suggestion2.id);
				expect(body[2].id).toBe(suggestion3.id);
			});

			describe('Sorting', () => {
				it('returns suggestions sorted by most voted by default', async () => {
					const res = await server.request(`/api/projects/${project.id}/suggestions`);
					const body = await res.json();
					expect(body).toHaveLength(3);
					expect(body[0].id).toBe(suggestion1.id);
					expect(body[1].id).toBe(suggestion2.id);
					expect(body[2].id).toBe(suggestion3.id);
				});

				it('returns suggestions sorted by newest', async () => {
					const res = await server.request(`/api/projects/${project.id}/suggestions?sortBy=newest`);
					const body = await res.json();
					expect(body).toHaveLength(3);
					expect(body[0].id).toBe(suggestion3.id);
					expect(body[1].id).toBe(suggestion2.id);
					expect(body[2].id).toBe(suggestion1.id);
				});
			});

			describe('Filtering', () => {
				it('returns suggestions filtered by category', async () => {
					const res = await server.request(`/api/projects/${project.id}/suggestions?categories=BUG`);
					const body = await res.json();
					expect(body).toHaveLength(1);
					expect(body[0].id).toBe(suggestion1.id);
				});

				it('returns suggestions filtered by status', async () => {
					const res = await server.request(`/api/projects/${project.id}/suggestions?statuses=PLANNED`);
					const body = await res.json();
					expect(body).toHaveLength(1);
					expect(body[0].id).toBe(suggestion3.id);
				});

				it('returns suggestions filtered by text search', async () => {
					const res = await server.request(`/api/projects/${project.id}/suggestions?search=Feature`);
					const body = await res.json();
					expect(body).toHaveLength(2);
					expect(body[0].id).toBe(suggestion2.id);
					expect(body[1].id).toBe(suggestion3.id);
				});
			});
		});
	});

	describe('PATCH /api/projects/:projectId/suggestions/:suggestionId/status', () => {
		const projectId = crypto.randomUUID();
		const suggestionId = crypto.randomUUID();

		describe('Error cases', () => {
			it('returns 401 when not authenticated', async () => {
				mockGetSession.mockResolvedValue(null);

				const res = await server.request(`/api/projects/${projectId}/suggestions/${suggestionId}/status`, {
					method: 'PATCH',
					headers: TEST_HEADERS,
					body: JSON.stringify({ status: 'PLANNED' }),
				});

				expect(res.status).toBe(401);
			});

			it('returns 403 when user is not a project admin', async () => {
				await db.insert(users).values(TEST_USER);
				const [project] = await db.insert(projects).values({ name: 'Test Project' }).returning();

				mockGetSession.mockResolvedValue({ user: TEST_USER, session: TEST_SESSION });

				const res = await server.request(`/api/projects/${project.id}/suggestions/${suggestionId}/status`, {
					method: 'PATCH',
					headers: TEST_HEADERS,
					body: JSON.stringify({ status: 'REJECTED', rejectionReason: 'Not needed' }),
				});

				expect(res.status).toBe(403);
			});

			it('returns 400 when status is invalid', async () => {
				await db.insert(users).values(TEST_USER);
				const [project] = await db.insert(projects).values({ name: 'Test Project' }).returning();
				await db.insert(projectMembers).values({ projectId: project.id, userId: TEST_USER.id, role: 'ADMIN' });

				mockGetSession.mockResolvedValue({ user: TEST_USER, session: TEST_SESSION });

				const res = await server.request(`/api/projects/${project.id}/suggestions/${crypto.randomUUID()}/status`, {
					method: 'PATCH',
					headers: TEST_HEADERS,
					body: JSON.stringify({ status: 'INVALID_STATUS' }),
				});

				expect(res.status).toBe(400);
			});

			it('returns 404 when suggestion does not exist', async () => {
				await db.insert(users).values(TEST_USER);
				const [project] = await db.insert(projects).values({ name: 'Test Project' }).returning();
				await db.insert(projectMembers).values({ projectId: project.id, userId: TEST_USER.id, role: 'ADMIN' });

				mockGetSession.mockResolvedValue({ user: TEST_USER, session: TEST_SESSION });

				const res = await server.request(`/api/projects/${project.id}/suggestions/${crypto.randomUUID()}/status`, {
					method: 'PATCH',
					headers: TEST_HEADERS,
					body: JSON.stringify({ status: 'REJECTED', rejectionReason: 'Not needed' }),
				});

				expect(res.status).toBe(404);
			});
		});

		describe('Success cases', () => {
			it('updates suggestion status and returns 200', async () => {
				await db.insert(users).values(TEST_USER);
				const [project] = await db.insert(projects).values({ name: 'Test Project' }).returning();
				await db.insert(projectMembers).values({ projectId: project.id, userId: TEST_USER.id, role: 'ADMIN' });
				const [suggestion] = await db
					.insert(suggestions)
					.values({ projectId: project.id, userId: TEST_USER.id, description: 'Dark mode', category: 'FEATURE' })
					.returning();

				mockGetSession.mockResolvedValue({ user: TEST_USER, session: TEST_SESSION });

				const res = await server.request(`/api/projects/${project.id}/suggestions/${suggestion.id}/status`, {
					method: 'PATCH',
					headers: TEST_HEADERS,
					body: JSON.stringify({ status: 'REJECTED', rejectionReason: 'Not feasible' }),
				});

				expect(res.status).toBe(200);
				const body = await res.json();
				expect(body.status).toBe('REJECTED');
				expect(body.rejectionReason).toBe('Not feasible');
			});
		});
	});

	describe('DELETE /api/projects/:projectId/suggestions/:suggestionId', () => {
		describe('Error cases', () => {
			it('returns 401 when not authenticated', async () => {
				mockGetSession.mockResolvedValue(null);

				const res = await server.request(`/api/projects/${crypto.randomUUID()}/suggestions/${crypto.randomUUID()}`, {
					method: 'DELETE',
					headers: TEST_HEADERS,
				});

				expect(res.status).toBe(401);
			});

			it('returns 403 when user is not the owner or a project admin', async () => {
				await db.insert(users).values(TEST_USER);
				const otherUser = { id: crypto.randomUUID(), name: 'Other', email: 'other@example.com', emailVerified: true, image: null };
				await db.insert(users).values(otherUser);
				const [project] = await db.insert(projects).values({ name: 'Test Project' }).returning();
				const [suggestion] = await db
					.insert(suggestions)
					.values({ projectId: project.id, userId: otherUser.id, description: 'Not mine', category: 'BUG' })
					.returning();

				mockGetSession.mockResolvedValue({ user: TEST_USER, session: TEST_SESSION });

				const res = await server.request(`/api/projects/${project.id}/suggestions/${suggestion.id}`, {
					method: 'DELETE',
					headers: TEST_HEADERS,
				});

				expect(res.status).toBe(403);
			});
		});

		describe('Success cases', () => {
			it('returns 204 when user is the suggestion owner', async () => {
				await db.insert(users).values(TEST_USER);
				const [project] = await db.insert(projects).values({ name: 'Test Project' }).returning();
				const [suggestion] = await db
					.insert(suggestions)
					.values({ projectId: project.id, userId: TEST_USER.id, description: 'My suggestion', category: 'BUG' })
					.returning();

				mockGetSession.mockResolvedValue({ user: TEST_USER, session: TEST_SESSION });

				const res = await server.request(`/api/projects/${project.id}/suggestions/${suggestion.id}`, {
					method: 'DELETE',
					headers: TEST_HEADERS,
				});

				expect(res.status).toBe(204);
			});

			it('returns 204 when user is a project admin but not the owner', async () => {
				const otherUser = { id: crypto.randomUUID(), name: 'Other', email: 'other@example.com', emailVerified: true, image: null };
				await db.insert(users).values([TEST_USER, otherUser]);
				const [project] = await db.insert(projects).values({ name: 'Test Project' }).returning();
				await db.insert(projectMembers).values({ projectId: project.id, userId: TEST_USER.id, role: 'ADMIN' });
				const [suggestion] = await db
					.insert(suggestions)
					.values({ projectId: project.id, userId: otherUser.id, description: 'Not my suggestion', category: 'BUG' })
					.returning();

				mockGetSession.mockResolvedValue({ user: TEST_USER, session: TEST_SESSION });

				const res = await server.request(`/api/projects/${project.id}/suggestions/${suggestion.id}`, {
					method: 'DELETE',
					headers: TEST_HEADERS,
				});

				expect(res.status).toBe(204);
			});
		});
	});

	describe('POST /api/suggestions/:suggestionId/votes', () => {
		describe('Error cases', () => {
			it('returns 400 when suggestionId is not a valid UUID', async () => {
				mockGetSession.mockResolvedValue({ user: TEST_USER, session: TEST_SESSION });

				const res = await server.request('/api/suggestions/not-a-uuid/votes', {
					method: 'POST',
					headers: TEST_HEADERS,
				});

				expect(res.status).toBe(400);
			});

			it('returns 401 when not authenticated', async () => {
				mockGetSession.mockResolvedValue(null);

				const res = await server.request(`/api/suggestions/${crypto.randomUUID()}/votes`, {
					method: 'POST',
					headers: TEST_HEADERS,
				});

				expect(res.status).toBe(401);
			});

			it('returns 409 when user has already voted', async () => {
				await db.insert(users).values(TEST_USER);
				const [project] = await db.insert(projects).values({ name: 'Test Project' }).returning();
				const [suggestion] = await db
					.insert(suggestions)
					.values({ projectId: project.id, userId: TEST_USER.id, description: 'Test', category: 'FEATURE' })
					.returning();

				mockGetSession.mockResolvedValue({ user: TEST_USER, session: TEST_SESSION });

				// Vote first
				await server.request(`/api/suggestions/${suggestion.id}/votes`, {
					method: 'POST',
					headers: TEST_HEADERS,
				});

				// Try to vote again
				const res = await server.request(`/api/suggestions/${suggestion.id}/votes`, {
					method: 'POST',
					headers: TEST_HEADERS,
				});

				expect(res.status).toBe(409);
			});
		});

		describe('Success cases', () => {
			it('creates a vote and returns 204', async () => {
				await db.insert(users).values(TEST_USER);
				const [project] = await db.insert(projects).values({ name: 'Test Project' }).returning();
				const [suggestion] = await db
					.insert(suggestions)
					.values({ projectId: project.id, userId: TEST_USER.id, description: 'Test', category: 'FEATURE' })
					.returning();

				mockGetSession.mockResolvedValue({ user: TEST_USER, session: TEST_SESSION });

				const res = await server.request(`/api/suggestions/${suggestion.id}/votes`, {
					method: 'POST',
					headers: TEST_HEADERS,
				});

				expect(res.status).toBe(204);
			});
		});
	});

	describe('DELETE /api/suggestions/:suggestionId/votes', () => {
		describe('Error cases', () => {
			it('returns 400 when suggestionId is not a valid UUID', async () => {
				mockGetSession.mockResolvedValue({ user: TEST_USER, session: TEST_SESSION });

				const res = await server.request('/api/suggestions/not-a-uuid/votes', {
					method: 'DELETE',
					headers: TEST_HEADERS,
				});

				expect(res.status).toBe(400);
			});

			it('returns 401 when not authenticated', async () => {
				mockGetSession.mockResolvedValue(null);

				const res = await server.request(`/api/suggestions/${crypto.randomUUID()}/votes`, {
					method: 'DELETE',
					headers: TEST_HEADERS,
				});

				expect(res.status).toBe(401);
			});
		});

		describe('Success cases', () => {
			it('removes a vote and returns 204', async () => {
				await db.insert(users).values(TEST_USER);
				const [project] = await db.insert(projects).values({ name: 'Test Project' }).returning();
				const [suggestion] = await db
					.insert(suggestions)
					.values({ projectId: project.id, userId: TEST_USER.id, description: 'Test', category: 'FEATURE' })
					.returning();

				mockGetSession.mockResolvedValue({ user: TEST_USER, session: TEST_SESSION });

				// Vote first
				await server.request(`/api/suggestions/${suggestion.id}/votes`, {
					method: 'POST',
					headers: TEST_HEADERS,
				});

				// Then unvote
				const res = await server.request(`/api/suggestions/${suggestion.id}/votes`, {
					method: 'DELETE',
					headers: TEST_HEADERS,
				});

				expect(res.status).toBe(204);
			});
		});
	});
});
