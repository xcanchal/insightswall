import { Page, Request, Route } from '@playwright/test';
import type { Session, User } from 'better-auth';

type FulfillOptions = Parameters<Route['fulfill']>[0];
type RouteHandler = (route: Route, request: Request) => Promise<void>;
type RouteResponder = FulfillOptions | RouteHandler;

export function mockGetSessionRequest(page: Page, response: { user: User; session: Session } | null) {
	return page.route('**/get-session', async (route) => {
		await route.fulfill({ json: response });
	});
}

export function mockGetProjectsRequest(page: Page, fulfill: FulfillOptions) {
	return page.route('**/api/projects', async (route) => {
		await route.fulfill(fulfill);
	});
}

export function mockCreateProjectRequest(page: Page, fulfill: FulfillOptions) {
	return page.route('**/api/projects', async (route, request) => {
		if (request.method() === 'POST') {
			await route.fulfill(fulfill);
			return;
		}

		await route.fallback();
	});
}

export function mockGetProjectRequest(page: Page, projectId: string, fulfill: FulfillOptions) {
	return page.route(`**/api/projects/${projectId}`, async (route, request) => {
		if (request.method() === 'GET') {
			await route.fulfill(fulfill);
			return;
		}

		await route.fallback();
	});
}

export function mockGetProjectMemberRequest(page: Page, projectId: string, fulfill: FulfillOptions) {
	return page.route(`**/api/projects/${projectId}/me`, async (route) => {
		await route.fulfill(fulfill);
	});
}

export function mockGetProjectSuggestionsRequest(page: Page, projectId: string, fulfill: FulfillOptions) {
	return page.route(`**/api/projects/${projectId}/suggestions**`, async (route, request) => {
		const url = new URL(request.url());
		if (request.method() === 'GET' && url.pathname === `/api/projects/${projectId}/suggestions`) {
			await route.fulfill(fulfill);
			return;
		}

		await route.fallback();
	});
}

export function mockGetProjectSuggestionsRequestWithHandler(page: Page, projectId: string, handler: RouteHandler) {
	return page.route(`**/api/projects/${projectId}/suggestions**`, async (route, request) => {
		const url = new URL(request.url());
		if (request.method() === 'GET' && url.pathname === `/api/projects/${projectId}/suggestions`) {
			await handler(route, request);
			return;
		}

		await route.fallback();
	});
}

export function mockCreateSuggestionRequest(page: Page, responder: RouteResponder) {
	return page.route('**/api/suggestions', async (route, request) => {
		if (request.method() !== 'POST') {
			await route.fallback();
			return;
		}

		if (typeof responder === 'function') {
			await responder(route, request);
			return;
		}

		await route.fulfill(responder);
	});
}

export function mockEditSuggestionRequest(page: Page, projectId: string, suggestionId: string, responder: RouteResponder) {
	return page.route(`**/api/projects/${projectId}/suggestions/${suggestionId}`, async (route, request) => {
		if (request.method() !== 'PATCH') {
			await route.fallback();
			return;
		}

		if (typeof responder === 'function') {
			await responder(route, request);
			return;
		}

		await route.fulfill(responder);
	});
}

export function mockDeleteSuggestionRequest(
	page: Page,
	projectId: string,
	suggestionId: string,
	responder: RouteResponder = { status: 204, body: '' }
) {
	return page.route(`**/api/projects/${projectId}/suggestions/${suggestionId}`, async (route, request) => {
		if (request.method() !== 'DELETE') {
			await route.fallback();
			return;
		}

		if (typeof responder === 'function') {
			await responder(route, request);
			return;
		}

		await route.fulfill(responder);
	});
}

export function mockUpdateSuggestionStatusRequest(page: Page, projectId: string, suggestionId: string, responder: RouteResponder) {
	return page.route(`**/api/projects/${projectId}/suggestions/${suggestionId}/status`, async (route, request) => {
		if (request.method() !== 'PATCH') {
			await route.fallback();
			return;
		}

		if (typeof responder === 'function') {
			await responder(route, request);
			return;
		}

		await route.fulfill(responder);
	});
}

export function mockVoteSuggestionRequest(page: Page, suggestionId: string, responder: RouteResponder = { status: 200, json: {} }) {
	return page.route(`**/api/suggestions/${suggestionId}/votes`, async (route, request) => {
		if (request.method() !== 'POST') {
			await route.fallback();
			return;
		}

		if (typeof responder === 'function') {
			await responder(route, request);
			return;
		}

		await route.fulfill(responder);
	});
}

export function mockUnvoteSuggestionRequest(page: Page, suggestionId: string, responder: RouteResponder = { status: 204, body: '' }) {
	return page.route(`**/api/suggestions/${suggestionId}/votes`, async (route, request) => {
		if (request.method() !== 'DELETE') {
			await route.fallback();
			return;
		}

		if (typeof responder === 'function') {
			await responder(route, request);
			return;
		}

		await route.fulfill(responder);
	});
}

export function mockUpdateProjectRequest(page: Page, projectId: string, fulfill: FulfillOptions) {
	return page.route(`**/api/projects/${projectId}`, async (route, request) => {
		if (request.method() === 'PATCH') {
			await route.fulfill(fulfill);
			return;
		}

		await route.fallback();
	});
}

export function mockDeleteProjectRequest(page: Page, projectId: string, fulfill: FulfillOptions = { status: 204, body: '' }) {
	return page.route(`**/api/projects/${projectId}`, async (route, request) => {
		if (request.method() === 'DELETE') {
			await route.fulfill(fulfill);
			return;
		}

		await route.fallback();
	});
}

export function buildApiError(message: string, status = 500) {
	return {
		status,
		json: {
			error: 'InternalServerError',
			message,
			statusCode: status,
		},
	};
}
