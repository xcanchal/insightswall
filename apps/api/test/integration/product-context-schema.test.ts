import { PGlite } from '@electric-sql/pglite';
import { count, eq } from 'drizzle-orm';
import { readFile } from 'node:fs/promises';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../../src/lib/auth.js', () => ({
	auth: {
		api: { getSession: vi.fn() },
		handler: vi.fn().mockResolvedValue(new Response('', { status: 200 })),
	},
}));
import { users } from '../../src/lib/db/auth-schema.js';
import {
	activityEvents,
	decisionAlternatives,
	decisions,
	evidence,
	objectLinks,
	outcomes,
	problems,
	productObjects,
	productObjectVersions,
	solutions,
} from '../../src/lib/db/product-context-schema.js';
import { projects } from '../../src/lib/db/schema.js';
import { ProductContextRepository } from '../../src/modules/product-context/infrastructure/product-context.repository.js';
import { createTestDb } from '../helpers.js';

const migrationUrls = [
	new URL('../../drizzle/0000_numerous_millenium_guard.sql', import.meta.url),
	new URL('../../drizzle/0001_tidy_queen_noir.sql', import.meta.url),
	new URL('../../drizzle/0002_romantic_ronan.sql', import.meta.url),
];

async function applySqlMigration(client: PGlite, url: URL) {
	const migration = await readFile(url, 'utf8');
	await client.exec(migration.replaceAll('--> statement-breakpoint', ''));
}

describe('Product Context migration compatibility', () => {
	it('applies after the legacy migrations without changing legacy data', async () => {
		const client = new PGlite();

		try {
			await applySqlMigration(client, migrationUrls[0]);
			await applySqlMigration(client, migrationUrls[1]);
			await client.query(`
				INSERT INTO users (id, name, email, email_verified, created_at, updated_at)
				VALUES ('legacy-user', 'Legacy User', 'legacy@example.com', true, now(), now())
			`);
			await client.query(`
				INSERT INTO projects (id, name)
				VALUES ('10000000-0000-4000-8000-000000000001', 'Legacy Project')
			`);
			await client.query(`
				INSERT INTO suggestions (id, project_id, user_id, description, category)
				VALUES (
					'20000000-0000-4000-8000-000000000001',
					'10000000-0000-4000-8000-000000000001',
					'legacy-user',
					'Keep this suggestion',
					'FEATURE'
				)
			`);

			await applySqlMigration(client, migrationUrls[2]);

			const legacyRows = await client.query<{ description: string }>('SELECT description FROM suggestions');
			const canonicalTable = await client.query<{ name: string }>(
				"SELECT table_name AS name FROM information_schema.tables WHERE table_name = 'product_objects'"
			);

			expect(legacyRows.rows).toEqual([{ description: 'Keep this suggestion' }]);
			expect(canonicalTable.rows).toEqual([{ name: 'product_objects' }]);
		} finally {
			await client.close();
		}
	});
});

describe('Product Context schema invariants', () => {
	let db: Awaited<ReturnType<typeof createTestDb>>;

	beforeEach(async () => {
		db = await createTestDb();
	});

	afterEach(async () => {
		await db.$client.close();
	});

	async function seedUserAndProject(name = 'Atlas Analytics') {
		const userId = crypto.randomUUID();
		await db.insert(users).values({
			id: userId,
			name: 'Atlas Admin',
			email: `${userId}@example.com`,
			emailVerified: true,
			createdAt: new Date(),
			updatedAt: new Date(),
		});
		const [project] = await db.insert(projects).values({ name }).returning();
		return { project, userId };
	}

	it('stores the complete canonical fixture in one transaction', async () => {
		const { project, userId } = await seedUserAndProject();

		await db.transaction(async (tx) => {
			const [problem] = await tx
				.insert(productObjects)
				.values({
					productId: project.id,
					kind: 'PROBLEM',
					title: 'Customers cannot organize large dashboard collections',
					summary: 'Teams with many dashboards struggle to find and group related work.',
					status: 'VALIDATED',
					createdBy: userId,
				})
				.returning();
			await tx.insert(problems).values({ objectId: problem.id });

			const evidenceContent = [
				'Our workspace has more than 80 dashboards and nobody can find the right one.',
				'Twelve organization-related support requests were recorded this quarter.',
				'Administrators group dashboard links in external documents as a workaround.',
			];
			const evidenceObjects = [];
			for (const [index, originalContent] of evidenceContent.entries()) {
				const [object] = await tx
					.insert(productObjects)
					.values({
						productId: project.id,
						kind: 'EVIDENCE',
						title: `Atlas evidence ${index + 1}`,
						status: 'ACTIVE',
						createdBy: userId,
					})
					.returning();
				evidenceObjects.push(object);
				await tx.insert(evidence).values({
					objectId: object.id,
					evidenceType: index === 1 ? 'SUPPORT_PATTERN' : index === 2 ? 'INTERVIEW_NOTE' : 'CUSTOMER_FEEDBACK',
					originalContent,
					sourceLabel: index === 1 ? 'Support queue' : 'Customer research',
				});
			}

			const [decision] = await tx
				.insert(productObjects)
				.values({
					productId: project.id,
					kind: 'DECISION',
					title: 'Use one-level collections',
					status: 'ACCEPTED',
					createdBy: userId,
				})
				.returning();
			await tx.insert(decisions).values({
				objectId: decision.id,
				question: 'How should customers organize dashboards?',
				outcome: 'Use one-level collections rather than nested folders.',
				rationale: 'Collections solve retrieval without introducing tree-management complexity.',
				decidedAt: new Date(),
			});
			await tx.insert(decisionAlternatives).values([
				{
					decisionObjectId: decision.id,
					title: 'Nested folders',
					disposition: 'REJECTED',
					rejectionReason: 'Hierarchy management adds complexity.',
					sortOrder: 0,
				},
				{
					decisionObjectId: decision.id,
					title: 'Tags only',
					disposition: 'REJECTED',
					rejectionReason: 'Customers asked for visible grouping and browsing.',
					sortOrder: 1,
				},
				{ decisionObjectId: decision.id, title: 'One-level collections', disposition: 'SELECTED', sortOrder: 2 },
			]);

			const [solution] = await tx
				.insert(productObjects)
				.values({
					productId: project.id,
					kind: 'SOLUTION',
					title: 'Dashboard collections',
					status: 'SHIPPED',
					createdBy: userId,
				})
				.returning();
			await tx.insert(solutions).values({
				objectId: solution.id,
				hypothesis: 'One-level collections let teams group dashboards without managing a hierarchy.',
				shippedAt: new Date(),
			});

			const [outcome] = await tx
				.insert(productObjects)
				.values({
					productId: project.id,
					kind: 'OUTCOME',
					title: 'Dashboard organization support requests decreased',
					status: 'RECORDED',
					createdBy: userId,
				})
				.returning();
			await tx.insert(outcomes).values({
				objectId: outcome.id,
				result: 'Dashboard-organization support requests decreased 31%.',
				observedAt: new Date(),
				numericValue: '31',
				unit: 'percent decrease',
			});

			await tx.insert(objectLinks).values([
				...evidenceObjects.map((object) => ({
					productId: project.id,
					fromObjectId: object.id,
					toObjectId: problem.id,
					relationshipType: 'SUPPORTS' as const,
					createdBy: userId,
				})),
				{
					productId: project.id,
					fromObjectId: evidenceObjects[0].id,
					toObjectId: decision.id,
					relationshipType: 'SUPPORTS',
					createdBy: userId,
				},
				{
					productId: project.id,
					fromObjectId: problem.id,
					toObjectId: decision.id,
					relationshipType: 'LED_TO',
					createdBy: userId,
				},
				{
					productId: project.id,
					fromObjectId: decision.id,
					toObjectId: solution.id,
					relationshipType: 'SELECTS',
					createdBy: userId,
				},
				{
					productId: project.id,
					fromObjectId: solution.id,
					toObjectId: problem.id,
					relationshipType: 'ADDRESSES',
					createdBy: userId,
				},
				{
					productId: project.id,
					fromObjectId: solution.id,
					toObjectId: outcome.id,
					relationshipType: 'MEASURED_BY',
					createdBy: userId,
				},
			]);

			await tx.insert(productObjectVersions).values({
				objectId: decision.id,
				version: 1,
				snapshot: { title: decision.title, status: decision.status },
				changedBy: userId,
				changeReason: 'Decision created',
			});
			await tx.insert(activityEvents).values(
				[problem, ...evidenceObjects, decision, solution, outcome].map((object) => ({
					productId: project.id,
					actorUserId: userId,
					eventType: `${object.kind}_CREATED`,
					objectId: object.id,
				}))
			);
		});

		const [{ value: objectCount }] = await db.select({ value: count() }).from(productObjects);
		const [{ value: linkCount }] = await db.select({ value: count() }).from(objectLinks);
		const [{ value: alternativeCount }] = await db.select({ value: count() }).from(decisionAlternatives);
		const [{ value: versionCount }] = await db.select({ value: count() }).from(productObjectVersions);
		const [{ value: activityCount }] = await db.select({ value: count() }).from(activityEvents);

		expect({ objectCount, linkCount, alternativeCount, versionCount, activityCount }).toEqual({
			objectCount: 7,
			linkCount: 8,
			alternativeCount: 3,
			versionCount: 1,
			activityCount: 7,
		});
	});

	it('rejects cross-Project links', async () => {
		const { project: firstProject } = await seedUserAndProject('First Project');
		const { project: secondProject } = await seedUserAndProject('Second Project');
		const [firstObject] = await db
			.insert(productObjects)
			.values({ productId: firstProject.id, kind: 'PROBLEM', title: 'First', status: 'EMERGING' })
			.returning();
		const [secondObject] = await db
			.insert(productObjects)
			.values({ productId: secondProject.id, kind: 'DECISION', title: 'Second', status: 'PROPOSED' })
			.returning();

		await expect(
			db.insert(objectLinks).values({
				productId: firstProject.id,
				fromObjectId: firstObject.id,
				toObjectId: secondObject.id,
				relationshipType: 'LED_TO',
			})
		).rejects.toThrow();
	});

	it('scopes repository reads to the requested Project boundary', async () => {
		const { project: firstProject } = await seedUserAndProject('First Project');
		const { project: secondProject } = await seedUserAndProject('Second Project');
		const [object] = await db
			.insert(productObjects)
			.values({ productId: firstProject.id, kind: 'PROBLEM', title: 'First', status: 'EMERGING' })
			.returning();
		const repository = new ProductContextRepository(db);

		await expect(repository.findObjectById(firstProject.id, object.id)).resolves.toMatchObject({ id: object.id });
		await expect(repository.findObjectById(secondProject.id, object.id)).resolves.toBeNull();
	});

	it('rejects duplicate active links and permits a replacement after archive', async () => {
		const { project } = await seedUserAndProject();
		const [fromObject] = await db
			.insert(productObjects)
			.values({ productId: project.id, kind: 'PROBLEM', title: 'Problem', status: 'EMERGING' })
			.returning();
		const [toObject] = await db
			.insert(productObjects)
			.values({ productId: project.id, kind: 'DECISION', title: 'Decision', status: 'PROPOSED' })
			.returning();
		const link = {
			productId: project.id,
			fromObjectId: fromObject.id,
			toObjectId: toObject.id,
			relationshipType: 'LED_TO' as const,
		};
		const [created] = await db.insert(objectLinks).values(link).returning();

		await expect(db.insert(objectLinks).values(link)).rejects.toThrow();
		await db.update(objectLinks).set({ archivedAt: new Date() }).where(eq(objectLinks.id, created.id));
		await expect(db.insert(objectLinks).values(link)).resolves.toBeDefined();
	});

	it('rejects a detail row whose object kind does not match', async () => {
		const { project } = await seedUserAndProject();
		const [problem] = await db
			.insert(productObjects)
			.values({ productId: project.id, kind: 'PROBLEM', title: 'Problem', status: 'EMERGING' })
			.returning();

		await expect(
			db.insert(evidence).values({ objectId: problem.id, evidenceType: 'CUSTOMER_FEEDBACK', originalContent: 'Feedback' })
		).rejects.toThrow();
	});

	it('rejects a status that is invalid for the object kind', async () => {
		const { project } = await seedUserAndProject();

		await expect(
			db.insert(productObjects).values({
				productId: project.id,
				kind: 'PROBLEM',
				title: 'Invalid problem',
				status: 'SHIPPED',
			})
		).rejects.toThrow();
	});

	it('rolls back a canonical write when its transaction fails', async () => {
		const { project } = await seedUserAndProject();
		const objectId = crypto.randomUUID();

		await expect(
			db.transaction(async (tx) => {
				await tx.insert(productObjects).values({
					id: objectId,
					productId: project.id,
					kind: 'PROBLEM',
					title: 'Rolled back',
					status: 'EMERGING',
				});
				throw new Error('stop the transaction');
			})
		).rejects.toThrow('stop the transaction');

		const rows = await db.select().from(productObjects).where(eq(productObjects.id, objectId));
		expect(rows).toHaveLength(0);
	});

	it('prevents deleting a Project that owns canonical history', async () => {
		const { project } = await seedUserAndProject();
		await db.insert(productObjects).values({
			productId: project.id,
			kind: 'PROBLEM',
			title: 'Retained problem',
			status: 'EMERGING',
		});

		await expect(db.delete(projects).where(eq(projects.id, project.id))).rejects.toThrow();
		const retained = await db.select().from(projects).where(eq(projects.id, project.id));
		expect(retained).toHaveLength(1);
	});
});
