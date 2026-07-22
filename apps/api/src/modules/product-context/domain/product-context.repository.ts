import type { ProductObjectEntity } from './product-object.entity.js';

export interface IProductContextRepository {
	findObjectById(productId: string, objectId: string): Promise<ProductObjectEntity | null>;
}
