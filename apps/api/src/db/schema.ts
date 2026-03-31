import { boolean, integer, pgEnum, pgTable, primaryKey, text, timestamp, uniqueIndex, uuid } from 'drizzle-orm/pg-core';

export const memberRoleEnum = pgEnum('member_role', ['USER', 'ADMIN']);
export const suggestionStatusEnum = pgEnum('suggestion_status', ['CREATED', 'REJECTED']);
export const roadmapStatusEnum = pgEnum('roadmap_status', ['PLANNED', 'IN_PROGRESS', 'DONE', 'DISCONTINUED']);
export const notificationTypeEnum = pgEnum('notification_type', [
	'SUGGESTION_CREATED',
	'SUGGESTION_REJECTED',
	'SUGGESTION_COMMENT',
	'ADDED_TO_ROADMAP',
	'ROADMAP_STATUS_CHANGED',
]);

export const users = pgTable('users', {
	id: uuid('id').primaryKey().defaultRandom(),
	email: text('email').notNull().unique(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const projects = pgTable('projects', {
	id: uuid('id').primaryKey().defaultRandom(),
	name: text('name').notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const projectMembers = pgTable(
	'project_members',
	{
		projectId: uuid('project_id')
			.notNull()
			.references(() => projects.id, { onDelete: 'cascade' }),
		userId: uuid('user_id')
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		role: memberRoleEnum('role').notNull().default('USER'),
		createdAt: timestamp('created_at').defaultNow().notNull(),
	},
	(t) => [primaryKey({ columns: [t.projectId, t.userId] })]
);

export const suggestions = pgTable('suggestions', {
	id: uuid('id').primaryKey().defaultRandom(),
	projectId: uuid('project_id')
		.notNull()
		.references(() => projects.id, { onDelete: 'cascade' }),
	userId: uuid('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	title: text('title').notNull(),
	description: text('description').notNull().default(''),
	status: suggestionStatusEnum('status').notNull().default('CREATED'),
	createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const votes = pgTable(
	'votes',
	{
		userId: uuid('user_id')
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		suggestionId: uuid('suggestion_id')
			.notNull()
			.references(() => suggestions.id, { onDelete: 'cascade' }),
		createdAt: timestamp('created_at').defaultNow().notNull(),
	},
	(t) => [primaryKey({ columns: [t.userId, t.suggestionId] })]
);

export const comments = pgTable('comments', {
	id: uuid('id').primaryKey().defaultRandom(),
	userId: uuid('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	suggestionId: uuid('suggestion_id')
		.notNull()
		.references(() => suggestions.id, { onDelete: 'cascade' }),
	message: text('message').notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const roadmapItems = pgTable(
	'roadmap_items',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		projectId: uuid('project_id')
			.notNull()
			.references(() => projects.id, { onDelete: 'cascade' }),
		suggestionId: uuid('suggestion_id')
			.notNull()
			.unique()
			.references(() => suggestions.id, { onDelete: 'cascade' }),
		status: roadmapStatusEnum('status').notNull().default('PLANNED'),
		position: integer('position').notNull(),
		createdAt: timestamp('created_at').defaultNow().notNull(),
	},
	(t) => [uniqueIndex('roadmap_items_project_status_position_idx').on(t.projectId, t.status, t.position)]
);

export const notifications = pgTable('notifications', {
	id: uuid('id').primaryKey().defaultRandom(),
	userId: uuid('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	projectId: uuid('project_id')
		.notNull()
		.references(() => projects.id, { onDelete: 'cascade' }),
	suggestionId: uuid('suggestion_id').references(() => suggestions.id, { onDelete: 'set null' }),
	roadmapItemId: uuid('roadmap_item_id').references(() => roadmapItems.id, { onDelete: 'set null' }),
	type: notificationTypeEnum('type').notNull(),
	title: text('title').notNull(),
	message: text('message').notNull(),
	isRead: boolean('is_read').notNull().default(false),
	createdAt: timestamp('created_at').defaultNow().notNull(),
});
