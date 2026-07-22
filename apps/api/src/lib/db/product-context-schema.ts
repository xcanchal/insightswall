import type { ObjectRelationshipType, ProductObjectKind, ProductObjectOrigin, ProductObjectStatus } from '@app/types';
import { sql } from 'drizzle-orm';
import {
	check,
	foreignKey,
	index,
	integer,
	jsonb,
	numeric,
	pgTable,
	text,
	timestamp,
	unique,
	uniqueIndex,
	uuid,
} from 'drizzle-orm/pg-core';
import { users } from './auth-schema.js';
import { projects } from './schema.js';

const contextTimestamps = {
	createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
	updatedAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
};

export const productObjects = pgTable(
	'product_objects',
	{
		id: uuid().primaryKey().defaultRandom(),
		productId: uuid('project_id')
			.notNull()
			.references(() => projects.id, { onDelete: 'restrict' }),
		kind: text().$type<ProductObjectKind>().notNull(),
		title: text().notNull(),
		summary: text(),
		status: text().$type<ProductObjectStatus>().notNull(),
		origin: text().$type<ProductObjectOrigin>().notNull().default('MANUAL'),
		createdBy: text().references(() => users.id, { onDelete: 'set null' }),
		...contextTimestamps,
		archivedAt: timestamp({ withTimezone: true }),
	},
	(t) => [
		unique('product_objects_product_id_id_unique').on(t.productId, t.id),
		unique('product_objects_id_kind_unique').on(t.id, t.kind),
		index('product_objects_product_kind_status_idx').on(t.productId, t.kind, t.status),
		index('product_objects_product_archived_idx').on(t.productId, t.archivedAt),
		check('product_objects_kind_check', sql`${t.kind} in ('PROBLEM', 'EVIDENCE', 'DECISION', 'SOLUTION', 'OUTCOME')`),
		check(
			'product_objects_kind_status_check',
			sql`(${t.kind} = 'PROBLEM' and ${t.status} in ('EMERGING', 'VALIDATED', 'ARCHIVED'))
				or (${t.kind} = 'EVIDENCE' and ${t.status} in ('ACTIVE', 'ARCHIVED'))
				or (${t.kind} = 'DECISION' and ${t.status} in ('PROPOSED', 'ACCEPTED', 'REJECTED', 'SUPERSEDED'))
				or (${t.kind} = 'SOLUTION' and ${t.status} in ('PROPOSED', 'IN_PROGRESS', 'SHIPPED', 'ABANDONED'))
				or (${t.kind} = 'OUTCOME' and ${t.status} = 'RECORDED')`
		),
	]
);

export const problems = pgTable(
	'problems',
	{
		objectId: uuid().primaryKey(),
		kind: text().$type<'PROBLEM'>().notNull().default('PROBLEM'),
	},
	(t) => [
		foreignKey({
			name: 'problems_object_kind_fk',
			columns: [t.objectId, t.kind],
			foreignColumns: [productObjects.id, productObjects.kind],
		}).onDelete('restrict'),
		check('problems_kind_check', sql`${t.kind} = 'PROBLEM'`),
	]
);

export const evidence = pgTable(
	'evidence',
	{
		objectId: uuid().primaryKey(),
		kind: text().$type<'EVIDENCE'>().notNull().default('EVIDENCE'),
		evidenceType: text().notNull(),
		originalContent: text().notNull(),
		observedAt: timestamp({ withTimezone: true }),
		sourceLabel: text(),
		sourceAuthor: text(),
		sourceUrl: text(),
	},
	(t) => [
		foreignKey({
			name: 'evidence_object_kind_fk',
			columns: [t.objectId, t.kind],
			foreignColumns: [productObjects.id, productObjects.kind],
		}).onDelete('restrict'),
		check('evidence_kind_check', sql`${t.kind} = 'EVIDENCE'`),
	]
);

export const decisions = pgTable(
	'decisions',
	{
		objectId: uuid().primaryKey(),
		kind: text().$type<'DECISION'>().notNull().default('DECISION'),
		question: text().notNull(),
		outcome: text(),
		rationale: text().notNull(),
		decidedAt: timestamp({ withTimezone: true }),
	},
	(t) => [
		foreignKey({
			name: 'decisions_object_kind_fk',
			columns: [t.objectId, t.kind],
			foreignColumns: [productObjects.id, productObjects.kind],
		}).onDelete('restrict'),
		check('decisions_kind_check', sql`${t.kind} = 'DECISION'`),
	]
);

export const decisionAlternatives = pgTable(
	'decision_alternatives',
	{
		id: uuid().primaryKey().defaultRandom(),
		decisionObjectId: uuid()
			.notNull()
			.references(() => decisions.objectId, { onDelete: 'restrict' }),
		title: text().notNull(),
		disposition: text().notNull(),
		rejectionReason: text(),
		sortOrder: integer().notNull().default(0),
	},
	(t) => [
		unique('decision_alternatives_decision_sort_unique').on(t.decisionObjectId, t.sortOrder),
		index('decision_alternatives_decision_idx').on(t.decisionObjectId),
	]
);

export const solutions = pgTable(
	'solutions',
	{
		objectId: uuid().primaryKey(),
		kind: text().$type<'SOLUTION'>().notNull().default('SOLUTION'),
		hypothesis: text(),
		shippedAt: timestamp({ withTimezone: true }),
	},
	(t) => [
		foreignKey({
			name: 'solutions_object_kind_fk',
			columns: [t.objectId, t.kind],
			foreignColumns: [productObjects.id, productObjects.kind],
		}).onDelete('restrict'),
		check('solutions_kind_check', sql`${t.kind} = 'SOLUTION'`),
	]
);

export const outcomes = pgTable(
	'outcomes',
	{
		objectId: uuid().primaryKey(),
		kind: text().$type<'OUTCOME'>().notNull().default('OUTCOME'),
		result: text().notNull(),
		observedAt: timestamp({ withTimezone: true }).notNull(),
		numericValue: numeric({ precision: 18, scale: 4 }),
		unit: text(),
		sourceLabel: text(),
		sourceUrl: text(),
	},
	(t) => [
		foreignKey({
			name: 'outcomes_object_kind_fk',
			columns: [t.objectId, t.kind],
			foreignColumns: [productObjects.id, productObjects.kind],
		}).onDelete('restrict'),
		check('outcomes_kind_check', sql`${t.kind} = 'OUTCOME'`),
		check(
			'outcomes_numeric_unit_check',
			sql`(${t.numericValue} is null and ${t.unit} is null) or (${t.numericValue} is not null and ${t.unit} is not null)`
		),
	]
);

export const objectLinks = pgTable(
	'object_links',
	{
		id: uuid().primaryKey().defaultRandom(),
		productId: uuid('project_id')
			.notNull()
			.references(() => projects.id, { onDelete: 'restrict' }),
		fromObjectId: uuid().notNull(),
		toObjectId: uuid().notNull(),
		relationshipType: text().$type<ObjectRelationshipType>().notNull(),
		createdBy: text().references(() => users.id, { onDelete: 'set null' }),
		createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
		archivedAt: timestamp({ withTimezone: true }),
	},
	(t) => [
		foreignKey({
			name: 'object_links_from_product_object_fk',
			columns: [t.productId, t.fromObjectId],
			foreignColumns: [productObjects.productId, productObjects.id],
		}).onDelete('restrict'),
		foreignKey({
			name: 'object_links_to_product_object_fk',
			columns: [t.productId, t.toObjectId],
			foreignColumns: [productObjects.productId, productObjects.id],
		}).onDelete('restrict'),
		uniqueIndex('object_links_active_unique')
			.on(t.fromObjectId, t.toObjectId, t.relationshipType)
			.where(sql`${t.archivedAt} is null`),
		index('object_links_from_idx').on(t.productId, t.fromObjectId, t.relationshipType),
		index('object_links_to_idx').on(t.productId, t.toObjectId, t.relationshipType),
		check('object_links_distinct_objects_check', sql`${t.fromObjectId} <> ${t.toObjectId}`),
		check(
			'object_links_relationship_type_check',
			sql`${t.relationshipType} in ('SUPPORTS', 'LED_TO', 'SELECTS', 'ADDRESSES', 'MEASURED_BY', 'SUPERSEDES')`
		),
	]
);

export const productObjectVersions = pgTable(
	'product_object_versions',
	{
		id: uuid().primaryKey().defaultRandom(),
		objectId: uuid()
			.notNull()
			.references(() => productObjects.id, { onDelete: 'restrict' }),
		version: integer().notNull(),
		snapshot: jsonb().$type<Record<string, unknown>>().notNull(),
		changedBy: text().references(() => users.id, { onDelete: 'set null' }),
		changeReason: text(),
		createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
	},
	(t) => [
		unique('product_object_versions_object_version_unique').on(t.objectId, t.version),
		index('product_object_versions_object_idx').on(t.objectId, t.version),
		check('product_object_versions_positive_version_check', sql`${t.version} > 0`),
	]
);

export const activityEvents = pgTable(
	'activity_events',
	{
		id: uuid().primaryKey().defaultRandom(),
		productId: uuid('project_id')
			.notNull()
			.references(() => projects.id, { onDelete: 'restrict' }),
		actorUserId: text().references(() => users.id, { onDelete: 'set null' }),
		eventType: text().notNull(),
		objectId: uuid(),
		occurredAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
	},
	(t) => [
		foreignKey({
			name: 'activity_events_product_object_fk',
			columns: [t.productId, t.objectId],
			foreignColumns: [productObjects.productId, productObjects.id],
		}).onDelete('restrict'),
		index('activity_events_product_occurred_idx').on(t.productId, t.occurredAt),
		index('activity_events_object_occurred_idx').on(t.objectId, t.occurredAt),
	]
);
