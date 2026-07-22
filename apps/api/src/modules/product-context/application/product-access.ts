import type { IProjectMemberRepository } from '../../projects/domain/project-member/project-member.repository.js';
import { ProductContextReadForbiddenError, ProductContextWriteForbiddenError } from '../domain/product-context.errors.js';

export class ProductAccess {
	constructor(private readonly projectMemberRepository: IProjectMemberRepository) {}

	async assertCanRead(userId: string, productId: string): Promise<void> {
		const member = await this.projectMemberRepository.findByUserAndProjectId(userId, productId);
		if (!member) throw new ProductContextReadForbiddenError();
	}

	async assertCanWrite(userId: string, productId: string): Promise<void> {
		const member = await this.projectMemberRepository.findByUserAndProjectId(userId, productId);
		if (member?.role !== 'ADMIN') throw new ProductContextWriteForbiddenError();
	}
}
