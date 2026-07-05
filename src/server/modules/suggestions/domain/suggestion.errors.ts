export class AlreadyVotedError extends Error {
	constructor() {
		super('Already voted');
		this.name = 'AlreadyVotedError';
	}
}

export class NotSuggestionOwnerError extends Error {
	constructor() {
		super('Not the suggestion owner');
		this.name = 'NotSuggestionOwnerError';
	}
}

export class NotOwnerOrAdminError extends Error {
	constructor() {
		super('Not the suggestion owner or project admin');
		this.name = 'NotOwnerOrAdminError';
	}
}
