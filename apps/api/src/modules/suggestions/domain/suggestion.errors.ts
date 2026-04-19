export class AlreadyVotedError extends Error {
	constructor() {
		super('Already voted');
		this.name = 'AlreadyVotedError';
	}
}
