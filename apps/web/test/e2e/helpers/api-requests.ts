import { Page } from '@playwright/test';
import { type ProjectResponse } from '../../../src/api/projects';
import type { Session } from 'better-auth';
import { SuggestionResponse } from '../../../src/api/suggestions';
import { ProjectMemberResponse } from '../../../src/api/project-members';

export function mockGetSessionRequest(page: Page, response: Session | null) {
	return page.route('**/get-session', async (route) => {
		await route.fulfill({ json: response });
	});
}

export function mockGetProjectsRequest(page: Page, response: ProjectResponse[]) {
	return page.route('**/api/projects', async (route) => {
		await route.fulfill({ json: response });
	});
}

export function mockCreateProjectRequest(page: Page, response: ProjectResponse) {
	return page.route('**/api/projects', async (route, request) => {
		if (request.method() === 'POST') {
			await route.fulfill({ status: 201, json: response });
			return;
		}

		await route.fallback();
	});
}

export function mockGetProjectRequest(page: Page, projectId: string, response: ProjectResponse) {
	return page.route(`**/api/projects/${projectId}`, async (route) => {
		await route.fulfill({ json: response });
	});
}

export function mockGetProjectMemberRequest(page: Page, projectId: string, response: ProjectMemberResponse) {
	return page.route(`**/api/projects/${projectId}/me`, async (route) => {
		await route.fulfill({ json: response });
	});
}

export function mockGetProjectSuggestionsRequest(page: Page, projectId: string, response: SuggestionResponse[]) {
	return page.route(`**/api/projects/${projectId}/suggestions`, async (route) => {
		await route.fulfill({ json: response });
	});
}

export function mockUpdateProjectRequest(page: Page, projectId: string, response: ProjectResponse) {
	return page.route(`**/api/projects/${projectId}`, async (route, request) => {
		if (request.method() === 'PATCH') {
			await route.fulfill({ json: response });
			return;
		}

		await route.fallback();
	});
}

export function mockDeleteProjectRequest(page: Page, projectId: string) {
	return page.route(`**/api/projects/${projectId}`, async (route, request) => {
		if (request.method() === 'DELETE') {
			await route.fulfill({ status: 204, body: '' });
			return;
		}

		await route.fallback();
	});
}
