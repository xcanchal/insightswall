import { expect, test, type Page } from '@playwright/test';
import {
	buildApiError,
	mockGetProjectMemberRequest,
	mockGetProjectRequest,
	mockGetProjectSuggestionsRequest,
	mockGetSessionRequest,
	mockUpdateSuggestionStatusRequest,
} from './helpers/api-requests';
import { projectFactory, projectMemberFactory, sessionFactory, suggestionFactory, userFactory } from './helpers/factories';

const project = projectFactory.build({ name: 'Public Feedback Board' });
const regularUser = userFactory.build();
const regularSession = sessionFactory.build({ userId: regularUser.id });
const regularProjectMember = projectMemberFactory.build({ projectId: project.id, userId: regularUser.id, role: 'USER' });
const adminUser = userFactory.build();
const adminSession = sessionFactory.build({ userId: adminUser.id });
const adminProjectMember = projectMemberFactory.build({ projectId: project.id, userId: adminUser.id, role: 'ADMIN' });

function roadmapColumn(page: Page, label: 'PLANNED' | 'IN PROGRESS' | 'DONE') {
	return page
		.locator('div.flex.flex-col.rounded-xl.bg-neutral-50')
		.filter({ has: page.getByText(label, { exact: true }) })
		.first();
}

function roadmapCard(page: Page, description: string) {
	return page.locator('div.border.rounded-lg.p-4').filter({ hasText: description }).first();
}

function suggestionCard(page: Page, description: string) {
	return page.locator('div.border.rounded-xl.p-6').filter({ hasText: description }).first();
}

async function dragRoadmapCard(page: Page, description: string, destinationStatus: 'PLANNED' | 'IN PROGRESS' | 'DONE') {
	const source = roadmapCard(page, description);
	const destination = roadmapColumn(page, destinationStatus);

	await source.scrollIntoViewIfNeeded();
	await destination.scrollIntoViewIfNeeded();

	const sourceBox = await source.boundingBox();
	const destinationBox = await destination.boundingBox();

	if (!sourceBox || !destinationBox) {
		throw new Error('Could not determine roadmap drag coordinates');
	}

	await page.mouse.move(sourceBox.x + sourceBox.width / 2, sourceBox.y + sourceBox.height / 2);
	await page.mouse.down();
	await page.mouse.move(destinationBox.x + destinationBox.width / 2, destinationBox.y + 96, { steps: 12 });
	await page.mouse.up();
}

test.describe('Roadmap page', () => {
	test.describe('When user is unauthenticated', () => {
		test.beforeEach(async ({ page }) => {
			await mockGetSessionRequest(page, null);
			await mockGetProjectRequest(page, project.id, { json: project });
		});

		test('shows the empty roadmap state without admin guidance', async ({ page }) => {
			await mockGetProjectSuggestionsRequest(page, project.id, { json: [] });

			await page.goto(`/project/${project.id}/roadmap`);

			await expect(page.getByRole('heading', { name: 'No suggestions in roadmap' })).toBeVisible();
			await expect(page.getByText('No suggestions have been added to the roadmap.')).toBeVisible();
			await expect(page.getByText('Change a suggestion status to Planned, In Progress, or Done to add them.')).not.toBeVisible();
		});
	});

	test.describe('When user is authenticated as regular user', () => {
		test.beforeEach(async ({ page }) => {
			await mockGetSessionRequest(page, { user: regularUser, session: regularSession });
			await mockGetProjectRequest(page, project.id, { json: project });
			await mockGetProjectMemberRequest(page, project.id, { json: regularProjectMember });
		});

		test('requests roadmap suggestions and renders them grouped by status', async ({ page }) => {
			const plannedSuggestion = suggestionFactory.build({
				projectId: project.id,
				status: 'PLANNED',
				description: 'Planned item',
				voteCount: 6,
				updatedAt: '2026-02-01T10:00:00.000Z',
			});
			const inProgressSuggestion = suggestionFactory.build({
				projectId: project.id,
				status: 'IN_PROGRESS',
				description: 'In progress item',
				voteCount: 3,
				updatedAt: '2026-02-02T10:00:00.000Z',
			});
			const doneSuggestion = suggestionFactory.build({
				projectId: project.id,
				status: 'DONE',
				description: 'Done item',
				voteCount: 8,
				updatedAt: '2026-02-03T10:00:00.000Z',
			});

			await mockGetProjectSuggestionsRequest(page, project.id, { json: [plannedSuggestion, inProgressSuggestion, doneSuggestion] });

			await page.goto(`/project/${project.id}/roadmap`);

			await page.waitForRequest((request) => {
				const url = new URL(request.url());
				return (
					request.method() === 'GET' &&
					url.pathname === `/api/projects/${project.id}/suggestions` &&
					url.searchParams.get('sortBy') === 'mostVoted' &&
					url.searchParams.getAll('statuses').join(',') === 'PLANNED,IN_PROGRESS,DONE'
				);
			});

			await expect(roadmapColumn(page, 'PLANNED').getByText(plannedSuggestion.description)).toBeVisible();
			await expect(roadmapColumn(page, 'IN PROGRESS').getByText(inProgressSuggestion.description)).toBeVisible();
			await expect(roadmapColumn(page, 'DONE').getByText(doneSuggestion.description)).toBeVisible();
			await expect(page.getByText('No suggestions in roadmap')).not.toBeVisible();
		});
	});

	test.describe('When user is authenticated as project admin', () => {
		test.beforeEach(async ({ page }) => {
			await mockGetSessionRequest(page, { user: adminUser, session: adminSession });
			await mockGetProjectRequest(page, project.id, { json: project });
			await mockGetProjectMemberRequest(page, project.id, { json: adminProjectMember });
		});

		test('shows the empty roadmap state with admin guidance', async ({ page }) => {
			await mockGetProjectSuggestionsRequest(page, project.id, { json: [] });

			await page.goto(`/project/${project.id}/roadmap`);

			await expect(page.getByRole('heading', { name: 'No suggestions in roadmap' })).toBeVisible();
			await expect(page.getByText('Change a suggestion status to Planned, In Progress, or Done to add them.')).toBeVisible();
		});

		test('moves a roadmap item to a new column', async ({ page }) => {
			const plannedSuggestion = suggestionFactory.build({
				projectId: project.id,
				status: 'PLANNED',
				description: 'Move me forward',
				updatedAt: '2026-02-01T10:00:00.000Z',
			});
			const existingInProgressSuggestion = suggestionFactory.build({
				projectId: project.id,
				status: 'IN_PROGRESS',
				description: 'Already in progress',
				updatedAt: '2026-02-02T10:00:00.000Z',
			});
			const updatedSuggestion = {
				...plannedSuggestion,
				status: 'IN_PROGRESS' as const,
				updatedAt: '2026-02-05T10:00:00.000Z',
			};

			await mockGetProjectSuggestionsRequest(page, project.id, { json: [plannedSuggestion, existingInProgressSuggestion] });
			await mockUpdateSuggestionStatusRequest(page, project.id, plannedSuggestion.id, { json: updatedSuggestion });

			await page.goto(`/project/${project.id}/roadmap`);
			await expect(roadmapColumn(page, 'PLANNED').getByText(plannedSuggestion.description)).toBeVisible();

			const statusRequest = page.waitForRequest((request) => {
				const url = new URL(request.url());
				if (request.method() !== 'PATCH' || url.pathname !== `/api/projects/${project.id}/suggestions/${plannedSuggestion.id}/status`) {
					return false;
				}

				const body = request.postDataJSON() as { status?: string };
				return body.status === 'IN_PROGRESS';
			});

			await mockGetProjectSuggestionsRequest(page, project.id, { json: [updatedSuggestion, existingInProgressSuggestion] });
			await dragRoadmapCard(page, plannedSuggestion.description, 'IN PROGRESS');

			await statusRequest;
			await expect(roadmapColumn(page, 'IN PROGRESS').getByText(plannedSuggestion.description)).toBeVisible();
			await expect(roadmapColumn(page, 'PLANNED').getByText(plannedSuggestion.description)).not.toBeVisible();
		});

		test('rolls back the roadmap move when status update fails', async ({ page }) => {
			const plannedSuggestion = suggestionFactory.build({
				projectId: project.id,
				status: 'PLANNED',
				description: 'Do not move',
				updatedAt: '2026-02-01T10:00:00.000Z',
			});

			await mockGetProjectSuggestionsRequest(page, project.id, { json: [plannedSuggestion] });
			await mockUpdateSuggestionStatusRequest(page, project.id, plannedSuggestion.id, buildApiError('Failed to update status'));

			await page.goto(`/project/${project.id}/roadmap`);
			await expect(roadmapColumn(page, 'PLANNED').getByText(plannedSuggestion.description)).toBeVisible();

			const statusRequest = page.waitForRequest((request) => {
				const url = new URL(request.url());
				if (request.method() !== 'PATCH' || url.pathname !== `/api/projects/${project.id}/suggestions/${plannedSuggestion.id}/status`) {
					return false;
				}

				const body = request.postDataJSON() as { status?: string };
				return body.status === 'DONE';
			});

			await dragRoadmapCard(page, plannedSuggestion.description, 'DONE');

			await statusRequest;
			await expect(page.getByText('Failed to update status')).toBeVisible();
			await expect(roadmapColumn(page, 'PLANNED').getByText(plannedSuggestion.description)).toBeVisible();
			await expect(roadmapColumn(page, 'DONE').getByText(plannedSuggestion.description)).not.toBeVisible();
		});

		test('shows a suggestion in roadmap after changing its status from suggestions', async ({ page }) => {
			const openSuggestion = suggestionFactory.build({
				projectId: project.id,
				userId: regularUser.id,
				status: 'OPEN',
				description: 'Promote me to roadmap',
			});
			const plannedSuggestion = {
				...openSuggestion,
				status: 'PLANNED' as const,
				updatedAt: '2026-02-05T10:00:00.000Z',
			};

			await mockGetProjectSuggestionsRequest(page, project.id, { json: [openSuggestion] });
			await mockUpdateSuggestionStatusRequest(page, project.id, openSuggestion.id, { json: plannedSuggestion });

			await page.goto(`/project/${project.id}/suggestions`);
			await suggestionCard(page, openSuggestion.description).getByRole('button', { name: 'Suggestion actions' }).click();
			await page.getByRole('menuitem', { name: 'Change status' }).click();

			const dialog = page.getByRole('dialog');
			await dialog.locator('[data-slot="select-trigger"]').click();
			await page.getByRole('option', { name: 'PLANNED' }).click();

			await mockGetProjectSuggestionsRequest(page, project.id, { json: [plannedSuggestion] });
			await dialog.getByRole('button', { name: 'Save' }).click();

			const roadmapRequest = page.waitForRequest((request) => {
				const url = new URL(request.url());
				return (
					request.method() === 'GET' &&
					url.pathname === `/api/projects/${project.id}/suggestions` &&
					url.searchParams.getAll('statuses').join(',') === 'PLANNED,IN_PROGRESS,DONE'
				);
			});

			await mockGetProjectSuggestionsRequest(page, project.id, { json: [plannedSuggestion] });
			await page.getByRole('link', { name: 'Roadmap' }).click();

			await roadmapRequest;
			await expect(page).toHaveURL(`/project/${project.id}/roadmap`);
			await expect(roadmapColumn(page, 'PLANNED').getByText(plannedSuggestion.description)).toBeVisible();
		});
	});
});
