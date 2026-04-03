import { UserEntity } from '../../domain/user.entity.js';
import type { IUserRepository } from '../../domain/user.repository.js';

export class GetUserUseCase {
	private readonly userRepository: IUserRepository;

	constructor(userRepository: IUserRepository) {
		this.userRepository = userRepository;
	}

	async execute(id: string): Promise<UserEntity | null> {
		const user = await this.userRepository.findById(id);
		if (!user) throw new Error('User not found'); // TODO: How to handle errors in Hono?
		return user;
	}
}
