import type { ProductObjectKind, ProductObjectOrigin, ProductObjectStatus } from '@app/types';

export interface ProductObjectEntity {
	id: string;
	productId: string;
	kind: ProductObjectKind;
	title: string;
	summary: string | null;
	status: ProductObjectStatus;
	origin: ProductObjectOrigin;
	createdBy: string | null;
	createdAt: Date;
	updatedAt: Date;
	archivedAt: Date | null;
}
