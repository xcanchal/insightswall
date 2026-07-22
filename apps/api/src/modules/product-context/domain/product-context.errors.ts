export class ProductContextReadForbiddenError extends Error {
	constructor() {
		super('Product Context read access denied');
		this.name = 'ProductContextReadForbiddenError';
	}
}

export class ProductContextWriteForbiddenError extends Error {
	constructor() {
		super('Product Context write access denied');
		this.name = 'ProductContextWriteForbiddenError';
	}
}
