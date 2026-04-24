import { Page, Route } from '@playwright/test';
import type { Session, User } from 'better-auth';

type FulfillOptions = Parameters<Route['fulfill']>[0];

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
	return page.route(`**/api/projects/${projectId}/suggestions**`, async (route) => {
		await route.fulfill(fulfill);
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
