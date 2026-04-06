import { boolean, integer, pgEnum, pgTable, primaryKey, text, timestamp, uniqueIndex, uuid } from 'drizzle-orm/pg-core';
import { users } from './auth-schema.js';

export const memberRoleEnum = pgEnum('member_role', ['USER', 'ADMIN']);
export const suggestionStatusEnum = pgEnum('suggestion_status', ['CREATED', 'REJECTED']);
export const suggestionCategoryEnum = pgEnum('suggestion_category', ['FEATURE', 'BUG']);
export const roadmapStatusEnum = pgEnum('roadmap_status', ['PLANNED', 'IN_PROGRESS', 'DONE', 'DISCONTINUED']);
export const notificationTypeEnum = pgEnum('notification_type', [
	'SUGGESTION_CREATED',
	'SUGGESTION_REJECTED',
	'SUGGESTION_COMMENT',
	'ADDED_TO_ROADMAP',
	'ROADMAP_STATUS_CHANGED',
]);

export const timestamps = {
	createdAt: timestamp().defaultNow().notNull(),
	updatedAt: timestamp(),
	/* deletedAt: timestamp(), */
};

export const projects = pgTable('projects', {
	id: uuid().primaryKey().defaultRandom(),
	name: text().notNull().unique(),
	...timestamps,
});

export const projectMembers = pgTable(
	'project_members',
	{
		projectId: uuid()
			.notNull()
			.references(() => projects.id, { onDelete: 'cascade' }),
		userId: uuid()
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		role: memberRoleEnum().notNull().default('USER'),
		...timestamps,
	},
	(t) => [primaryKey({ columns: [t.projectId, t.userId] })]
);

export const suggestions = pgTable('suggestions', {
	id: uuid().primaryKey().defaultRandom(),
	projectId: uuid()
		.notNull()
		.references(() => projects.id, { onDelete: 'cascade' }),
	userId: uuid()
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	description: text().notNull(),
	category: suggestionCategoryEnum().notNull(),
	status: suggestionStatusEnum().notNull().default('CREATED'),
	...timestamps,
});

export const votes = pgTable(
	'votes',
	{
		userId: uuid()
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		suggestionId: uuid()
			.notNull()
			.references(() => suggestions.id, { onDelete: 'cascade' }),
		...timestamps,
	},
	(t) => [primaryKey({ columns: [t.userId, t.suggestionId] })]
);

export const comments = pgTable('comments', {
	id: uuid().primaryKey().defaultRandom(),
	userId: uuid()
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	suggestionId: uuid()
		.notNull()
		.references(() => suggestions.id, { onDelete: 'cascade' }),
	message: text().notNull(),
	...timestamps,
});

export const roadmapItems = pgTable(
	'roadmap_items',
	{
		id: uuid().primaryKey().defaultRandom(),
		projectId: uuid()
			.notNull()
			.references(() => projects.id, { onDelete: 'cascade' }),
		suggestionId: uuid()
			.notNull()
			.unique()
			.references(() => suggestions.id, { onDelete: 'cascade' }),
		status: roadmapStatusEnum().notNull().default('PLANNED'),
		position: integer('position').notNull(),
		...timestamps,
	},
	(t) => [uniqueIndex('roadmap_items_project_status_position_idx').on(t.projectId, t.status, t.position)]
);

export const notifications = pgTable('notifications', {
	id: uuid().primaryKey().defaultRandom(),
	userId: uuid()
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	projectId: uuid()
		.notNull()
		.references(() => projects.id, { onDelete: 'cascade' }),
	suggestionId: uuid().references(() => suggestions.id, { onDelete: 'set null' }),
	roadmapItemId: uuid().references(() => roadmapItems.id, { onDelete: 'set null' }),
	type: notificationTypeEnum().notNull(),
	message: text().notNull(),
	isRead: boolean().notNull().default(false),
	...timestamps,
});
