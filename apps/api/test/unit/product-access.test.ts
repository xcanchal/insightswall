import { describe, expect, it, vi } from 'vitest';
import { ProductAccess } from '../../src/modules/product-context/application/product-access.js';
import {
	ProductContextReadForbiddenError,
	ProductContextWriteForbiddenError,
} from '../../src/modules/product-context/domain/product-context.errors.js';
import type { IProjectMemberRepository } from '../../src/modules/projects/domain/project-member/project-member.repository.js';

const productId = crypto.randomUUID();
const userId = 'user-1';

function createRepository(role: 'USER' | 'ADMIN' | null): IProjectMemberRepository {
	return {
		findByUserAndProjectId: vi.fn().mockResolvedValue(
			role
				? {
						projectId: productId,
						userId,
						role,
						createdAt: new Date(),
						updatedAt: null,
					}
				: null
		),
	};
}

describe('ProductAccess', () => {
	it('allows any project member to read', async () => {
		await expect(new ProductAccess(createRepository('USER')).assertCanRead(userId, productId)).resolves.toBeUndefined();
	});

	it('rejects a non-member read', async () => {
		await expect(new ProductAccess(createRepository(null)).assertCanRead(userId, productId)).rejects.toBeInstanceOf(
			ProductContextReadForbiddenError
		);
	});

	it('allows an ADMIN member to write', async () => {
		await expect(new ProductAccess(createRepository('ADMIN')).assertCanWrite(userId, productId)).resolves.toBeUndefined();
	});

	it('rejects a USER member write', async () => {
		await expect(new ProductAccess(createRepository('USER')).assertCanWrite(userId, productId)).rejects.toBeInstanceOf(
			ProductContextWriteForbiddenError
		);
	});

	it('rejects a non-member write', async () => {
		await expect(new ProductAccess(createRepository(null)).assertCanWrite(userId, productId)).rejects.toBeInstanceOf(
			ProductContextWriteForbiddenError
		);
	});
});
