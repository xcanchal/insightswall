import { and, eq } from 'drizzle-orm';
import { db as dbInstance } from '../../../lib/db/index.js';
import { productObjects } from '../../../lib/db/product-context-schema.js';
import type { ProductObjectEntity } from '../domain/product-object.entity.js';
import type { IProductContextRepository } from '../domain/product-context.repository.js';

type ProductContextReadDb = Pick<typeof dbInstance, 'select'>;

export class ProductContextRepository implements IProductContextRepository {
	constructor(private readonly db: ProductContextReadDb) {}

	async findObjectById(productId: string, objectId: string): Promise<ProductObjectEntity | null> {
		const [object] = await this.db
			.select()
			.from(productObjects)
			.where(and(eq(productObjects.productId, productId), eq(productObjects.id, objectId)))
			.limit(1);

		return object ?? null;
	}
}
