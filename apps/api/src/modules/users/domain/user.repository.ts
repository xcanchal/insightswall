import { UserEntity } from './user.entity.js';

export interface IUserRepository {
	findById(id: string): Promise<UserEntity | null>;
}
