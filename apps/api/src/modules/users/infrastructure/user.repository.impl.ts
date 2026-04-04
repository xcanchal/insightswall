import { eq } from 'drizzle-orm';
import { db as dbInstance } from '../../../lib/db/index.js';
import type { IUserRepository } from '../domain/user.repository.js';
import { users } from '../../../lib/db/auth-schema.js';
import { toUser } from './user.mapper.js';
import { UserEntity } from '../domain/user.entity.js';

export class UserRepository implements IUserRepository {
	private db: typeof dbInstance;

	constructor(db: typeof dbInstance) {
		this.db = db;
	}

	async findById(id: string): Promise<UserEntity | null> {
		const row = await this.db.query.users.findFirst({ where: eq(users.id, id) });
		return row ? toUser(row) : null;
	}
}
