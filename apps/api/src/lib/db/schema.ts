import { boolean, pgEnum, pgTable, primaryKey, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { users } from './auth-schema.js';
import { MEMBER_ROLES, NOTIFICATION_TYPES, SUGGESTION_CATEGORIES, SUGGESTION_STATUSES } from '@app/types';

export const memberRoleEnum = pgEnum('member_role', MEMBER_ROLES);
export const suggestionStatusEnum = pgEnum('suggestion_status', SUGGESTION_STATUSES);
export const suggestionCategoryEnum = pgEnum('suggestion_category', SUGGESTION_CATEGORIES);
export const notificationTypeEnum = pgEnum('notification_type', NOTIFICATION_TYPES);

export const timestamps = {
	createdAt: timestamp().defaultNow().notNull(),
	updatedAt: timestamp(),
};

export const projects = pgTable('projects', {
	id: uuid().primaryKey().defaultRandom(),
	name: text().notNull(),
	url: text(),
	...timestamps,
});

export const projectMembers = pgTable(
	'project_members',
	{
		projectId: uuid()
			.notNull()
			.references(() => projects.id, { onDelete: 'cascade' }),
		userId: text()
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
	userId: text()
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	description: text().notNull(),
	category: suggestionCategoryEnum().notNull(),
	status: suggestionStatusEnum().notNull().default('OPEN'),
	...timestamps,
});

export const votes = pgTable(
	'votes',
	{
		userId: text()
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
	userId: text()
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	suggestionId: uuid()
		.notNull()
		.references(() => suggestions.id, { onDelete: 'cascade' }),
	message: text().notNull(),
	...timestamps,
});

export const notifications = pgTable('notifications', {
	id: uuid().primaryKey().defaultRandom(),
	userId: text()
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	projectId: uuid()
		.notNull()
		.references(() => projects.id, { onDelete: 'cascade' }),
	suggestionId: uuid().references(() => suggestions.id, { onDelete: 'set null' }),
	type: notificationTypeEnum().notNull(),
	message: text().notNull(),
	isRead: boolean().notNull().default(false),
	...timestamps,
});
