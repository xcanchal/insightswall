import type { InferSelectModel } from 'drizzle-orm';
import { users } from '../../../db/auth-schema.js';
import type { UserEntity } from '../domain/user.entity.js';

type UserRow = InferSelectModel<typeof users>;

export function toUser(row: UserRow): UserEntity {
	return {
		id: row.id,
		name: row.name,
		email: row.email,
		emailVerified: row.emailVerified,
		image: row.image,
		createdAt: row.createdAt,
		updatedAt: row.updatedAt,
	};
}
