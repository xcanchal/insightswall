import { expect, test, type Page } from '@playwright/test';
import { projectFactory, projectMemberFactory, sessionFactory, suggestionFactory, userFactory } from './helpers/factories';
import {
	buildApiError,
	mockCreateSuggestionRequest,
	mockDeleteSuggestionRequest,
	mockEditSuggestionRequest,
	mockGetProjectMemberRequest,
	mockGetProjectRequest,
	mockGetProjectSuggestionsRequest,
	mockGetSessionRequest,
	mockUpdateSuggestionStatusRequest,
	mockUnvoteSuggestionRequest,
	mockVoteSuggestionRequest,
} from './helpers/api-requests';

const project = projectFactory.build();
const regularUser = userFactory.build();
const regularSession = sessionFactory.build({ userId: regularUser.id });
const regularProjectMember = projectMemberFactory.build({ projectId: project.id, userId: regularUser.id, role: 'USER' });
const adminUser = userFactory.build();
const adminSession = sessionFactory.build({ userId: adminUser.id });
const adminProjectMember = projectMemberFactory.build({ projectId: project.id, userId: adminUser.id, role: 'ADMIN' });

const suggestions = [
	suggestionFactory.build({
		projectId: project.id,
		description: 'Dashboard export',
		category: 'FEATURE',
		status: 'OPEN',
		voteCount: 5,
		createdAt: '2026-01-01T10:00:00.000Z',
	}),
	suggestionFactory.build({
		projectId: project.id,
		description: 'Crash on Safari',
		category: 'BUG',
		status: 'OPEN',
		voteCount: 2,
		createdAt: '2026-01-02T10:00:00.000Z',
	}),
	suggestionFactory.build({
		projectId: project.id,
		description: 'Billing issue',
		category: 'BUG',
		status: 'REJECTED',
		rejectionReason: 'Duplicate report',
		voteCount: 0,
		createdAt: '2026-01-03T10:00:00.000Z',
	}),
];

function suggestionCard(page: Page, description: string) {
	return page.locator('div.border.rounded-xl.p-6').filter({ hasText: description }).first();
}

function suggestionVoteCount(page: Page, description: string) {
	return suggestionCard(page, description).getByRole('group').locator('p').first();
}

test.describe('Suggestions page', () => {
	test.describe('When user is unauthenticated', () => {
		test.beforeEach(async ({ page }) => {
			await mockGetSessionRequest(page, null);
			await mockGetProjectRequest(page, project.id, { json: project });
		});

		test('renders suggestions and hides authenticated-only controls', async ({ page }) => {
			await mockGetProjectSuggestionsRequest(page, project.id, { json: suggestions });

			await page.goto(`/project/${project.id}/suggestions`);

			await expect(page.getByRole('heading', { name: project.name })).toBeVisible();
			await expect(page.getByText(suggestions[0].description)).toBeVisible();
			await expect(page.getByText(suggestions[1].description)).toBeVisible();
			await expect(page.getByText(suggestions[2].description)).toBeVisible();
			await expect(page.getByRole('button', { name: 'Submit suggestion' })).toBeVisible();
			await expect(page.getByRole('button', { name: 'Embed widget' })).not.toBeVisible();
			await expect(page.getByRole('button', { name: 'Suggestion actions' })).toHaveCount(0);
		});

		test('opens sign-in dialog when trying to submit a suggestion', async ({ page }) => {
			await mockGetProjectSuggestionsRequest(page, project.id, { json: [] });

			await page.goto(`/project/${project.id}/suggestions`);
			await page.getByRole('button', { name: 'Submit suggestion' }).click();

			await expect(page.getByRole('heading', { name: 'Sign in required' })).toBeVisible();
			await expect(page.getByText('Create a free account or log in to submit a suggestion.')).toBeVisible();
			await expect(page.getByRole('link', { name: 'Log in' })).toBeVisible();
			await expect(page.getByRole('link', { name: 'Sign up' })).toBeVisible();
		});

		test('opens sign-in dialog when trying to vote on a suggestion', async ({ page }) => {
			await mockGetProjectSuggestionsRequest(page, project.id, { json: suggestions });

			await page.goto(`/project/${project.id}/suggestions`);
			await page.getByRole('button', { name: 'Vote on suggestion' }).first().click();

			await expect(page.getByRole('heading', { name: 'Sign in required' })).toBeVisible();
			await expect(page.getByText('Create a free account or log in to vote on suggestions.')).toBeVisible();
		});

		test('can search suggestions', async ({ page }) => {
			await mockGetProjectSuggestionsRequest(page, project.id, { json: suggestions });

			await page.goto(`/project/${project.id}/suggestions`);
			await expect(page.getByPlaceholder('Search...')).toBeVisible();
			const searchRequest = page.waitForRequest((request) => {
				const url = new URL(request.url());
				return (
					request.method() === 'GET' &&
					url.pathname === `/api/projects/${project.id}/suggestions` &&
					url.searchParams.get('search') === 'dashboard'
				);
			});
			await mockGetProjectSuggestionsRequest(page, project.id, { json: [suggestions[0]] });

			await page.getByPlaceholder('Search...').fill('dashboard');

			await searchRequest;
			await expect(page).toHaveURL(/search=dashboard/);
			await expect(page.getByText(suggestions[0].description)).toBeVisible();
			await expect(page.getByText(suggestions[1].description)).not.toBeVisible();
		});

		test('can filter suggestions', async ({ page }) => {
			await mockGetProjectSuggestionsRequest(page, project.id, { json: suggestions });

			await page.goto(`/project/${project.id}/suggestions`);
			await expect(page.getByPlaceholder('Search...')).toBeVisible();
			const filterRequest = page.waitForRequest((request) => {
				const url = new URL(request.url());
				return (
					request.method() === 'GET' &&
					url.pathname === `/api/projects/${project.id}/suggestions` &&
					url.searchParams.getAll('categories').includes('BUG') &&
					!url.searchParams.getAll('categories').includes('FEATURE')
				);
			});
			await mockGetProjectSuggestionsRequest(page, project.id, { json: [suggestions[1], suggestions[2]] });

			await page.getByRole('button', { name: 'Category' }).click();
			await page.getByRole('menuitemcheckbox', { name: 'FEATURE' }).click();
			await page.keyboard.press('Escape');

			await filterRequest;
			await expect(page).toHaveURL(new RegExp(`categories=${encodeURIComponent('["BUG"]')}`));
			await expect(page.getByText(suggestions[1].description)).toBeVisible();
			await expect(page.getByText(suggestions[2].description)).toBeVisible();
			await expect(page.getByText(suggestions[0].description)).not.toBeVisible();
		});

		test('can sort suggestions', async ({ page }) => {
			await mockGetProjectSuggestionsRequest(page, project.id, { json: suggestions });

			await page.goto(`/project/${project.id}/suggestions`);
			await expect(page.getByPlaceholder('Search...')).toBeVisible();
			const sortRequest = page.waitForRequest((request) => {
				const url = new URL(request.url());
				return (
					request.method() === 'GET' &&
					url.pathname === `/api/projects/${project.id}/suggestions` &&
					url.searchParams.get('sortBy') === 'newest'
				);
			});
			await mockGetProjectSuggestionsRequest(page, project.id, { json: [suggestions[2], suggestions[1], suggestions[0]] });
			await page.getByRole('button', { name: 'Newest' }).click();

			await sortRequest;
			await expect(page).toHaveURL(/show=newest/);

			const descriptions = page.locator('p.text-lg span');
			await expect(descriptions.nth(0)).toHaveText(suggestions[2].description);
			await expect(descriptions.nth(1)).toHaveText(suggestions[1].description);
			await expect(descriptions.nth(2)).toHaveText(suggestions[0].description);
		});
	});

	test.describe('When user is authenticated as regular user', () => {
		test.beforeEach(async ({ page }) => {
			await mockGetSessionRequest(page, { user: regularUser, session: regularSession });
			await mockGetProjectRequest(page, project.id, { json: project });
			await mockGetProjectMemberRequest(page, project.id, { json: regularProjectMember });
		});

		test.describe('Suggestions list', () => {
			test('shows the empty state when the project has no suggestions', async ({ page }) => {
				await mockGetProjectSuggestionsRequest(page, project.id, { json: [] });

				await page.goto(`/project/${project.id}/suggestions`);

				await expect(page.getByRole('heading', { name: 'No suggestions created' })).toBeVisible();
				await expect(page.getByText('Be the first one to submit a suggestion')).toBeVisible();
				await expect(page.getByRole('button', { name: 'Submit suggestion' })).toBeVisible();
			});

			test('renders the suggestions list', async ({ page }) => {
				await mockGetProjectSuggestionsRequest(page, project.id, { json: suggestions });

				await page.goto(`/project/${project.id}/suggestions`);

				const descriptions = page.locator('p.text-lg span');
				await expect(descriptions.nth(0)).toHaveText(suggestions[0].description);
				await expect(descriptions.nth(1)).toHaveText(suggestions[1].description);
				await expect(descriptions.nth(2)).toHaveText(suggestions[2].description);
				await expect(page.getByPlaceholder('Search...')).toBeVisible();
			});

			test('shows an error state when loading suggestions fails', async ({ page }) => {
				await mockGetProjectSuggestionsRequest(page, project.id, buildApiError('Failed to load suggestions'));

				await page.goto(`/project/${project.id}/suggestions`);

				await expect(page.getByText('Failed to load suggestions')).toBeVisible({ timeout: 15000 });
			});
		});

		test.describe('Create suggestion', () => {
			test('creates a suggestion from the empty state', async ({ page }) => {
				const newSuggestion = suggestionFactory.build({
					projectId: project.id,
					userId: regularUser.id,
				});
				await mockGetProjectSuggestionsRequest(page, project.id, { json: [] });
				await mockCreateSuggestionRequest(page, { status: 201, json: newSuggestion });

				await page.goto(`/project/${project.id}/suggestions`);
				await page.getByRole('button', { name: 'Submit suggestion' }).click();

				await mockGetProjectSuggestionsRequest(page, project.id, { json: [newSuggestion] });
				await page.getByLabel('Description').fill(newSuggestion.description);
				await page.getByRole('dialog').getByRole('button', { name: 'Submit' }).click();

				await expect(page.getByText('Suggestion submitted')).toBeVisible();
				await expect(page.getByRole('heading', { name: 'Submit a suggestion' })).not.toBeVisible();
				await expect(suggestionCard(page, newSuggestion.description)).toBeVisible();
			});

			test('creates a suggestion from the list toolbar', async ({ page }) => {
				const newSuggestion = suggestionFactory.build({
					projectId: project.id,
					userId: regularUser.id,
				});
				await mockGetProjectSuggestionsRequest(page, project.id, { json: suggestions });
				await mockCreateSuggestionRequest(page, { status: 201, json: newSuggestion });

				await page.goto(`/project/${project.id}/suggestions`);
				await page.getByRole('button', { name: 'Submit suggestion' }).click();
				await mockGetProjectSuggestionsRequest(page, project.id, { json: [newSuggestion, ...suggestions] });
				await page.getByLabel('Description').fill(newSuggestion.description);
				await page.getByRole('dialog').getByRole('button', { name: 'Submit' }).click();

				await expect(page.getByText('Suggestion submitted')).toBeVisible();
				await expect(page.getByRole('heading', { name: 'Submit a suggestion' })).not.toBeVisible();
				await expect(suggestionCard(page, newSuggestion.description)).toBeVisible();
				await expect(suggestionCard(page, suggestions[0].description)).toBeVisible();
			});

			test('does not submit the form with invalid values', async ({ page }) => {
				await mockGetProjectSuggestionsRequest(page, project.id, { json: suggestions.slice(0, 1) });

				await page.goto(`/project/${project.id}/suggestions`);
				await page.getByRole('button', { name: 'Submit suggestion' }).click();
				await page.getByRole('dialog').getByRole('button', { name: 'Submit' }).click();

				await expect(page.getByText('Description is required')).toBeVisible();

				await page.getByLabel('Description').fill('x'.repeat(501));
				await page.getByRole('dialog').getByRole('button', { name: 'Submit' }).click();

				await expect(page.getByText('Max 500 characters')).toBeVisible();
			});

			test('shows an error when suggestion creation fails', async ({ page }) => {
				await mockGetProjectSuggestionsRequest(page, project.id, { json: suggestions.slice(0, 1) });
				await mockCreateSuggestionRequest(page, buildApiError('Failed to create suggestion'));

				await page.goto(`/project/${project.id}/suggestions`);
				await page.getByRole('button', { name: 'Submit suggestion' }).click();
				await page.getByLabel('Description').fill('Broken create flow');
				await page.getByRole('dialog').getByRole('button', { name: 'Submit' }).click();

				await expect(page.getByText('Failed to create suggestion')).toBeVisible();
				await expect(page.getByRole('heading', { name: 'Submit a suggestion' })).toBeVisible();
				await expect(page.getByLabel('Description')).toHaveValue('Broken create flow');
			});
		});

		test.describe('Search, filters, and sorting', () => {
			test('updates the URL and request when searching suggestions', async ({ page }) => {
				await mockGetProjectSuggestionsRequest(page, project.id, { json: suggestions });

				await page.goto(`/project/${project.id}/suggestions`);
				await expect(page.getByPlaceholder('Search...')).toBeVisible();
				const searchRequest = page.waitForRequest((request) => {
					const url = new URL(request.url());
					return (
						request.method() === 'GET' &&
						url.pathname === `/api/projects/${project.id}/suggestions` &&
						url.searchParams.get('search') === 'billing'
					);
				});
				await mockGetProjectSuggestionsRequest(page, project.id, { json: [suggestions[2]] });
				await page.getByPlaceholder('Search...').fill('billing');

				await searchRequest;
				await expect(page).toHaveURL(/search=billing/);
				await expect(page.getByText(suggestions[2].description)).toBeVisible();
				await expect(page.getByText(suggestions[0].description)).not.toBeVisible();
			});

			test('filters suggestions by category', async ({ page }) => {
				await mockGetProjectSuggestionsRequest(page, project.id, { json: suggestions });
				await page.goto(`/project/${project.id}/suggestions`);

				const filterRequest = page.waitForRequest((request) => {
					const url = new URL(request.url());
					return (
						request.method() === 'GET' &&
						url.pathname === `/api/projects/${project.id}/suggestions` &&
						url.searchParams.getAll('categories').includes('BUG') &&
						!url.searchParams.getAll('categories').includes('FEATURE')
					);
				});
				await mockGetProjectSuggestionsRequest(page, project.id, { json: [suggestions[1], suggestions[2]] });
				await page.getByRole('button', { name: 'Category' }).click();
				await page.getByRole('menuitemcheckbox', { name: 'FEATURE' }).click();
				await page.keyboard.press('Escape');

				await filterRequest;
				await expect(page).toHaveURL(new RegExp(`categories=${encodeURIComponent('["BUG"]')}`));
				await expect(page.getByText(suggestions[1].description)).toBeVisible();
				await expect(page.getByText(suggestions[0].description)).not.toBeVisible();
			});

			test('filters suggestions by status', async ({ page }) => {
				await mockGetProjectSuggestionsRequest(page, project.id, { json: suggestions });

				await page.goto(`/project/${project.id}/suggestions`);

				const filterRequest = page.waitForRequest((request) => {
					const url = new URL(request.url());
					return (
						request.method() === 'GET' &&
						url.pathname === `/api/projects/${project.id}/suggestions` &&
						url.searchParams.getAll('statuses').includes('REJECTED') &&
						!url.searchParams.getAll('statuses').includes('OPEN')
					);
				});
				await mockGetProjectSuggestionsRequest(page, project.id, { json: [suggestions[2]] });
				await page.getByRole('button', { name: 'Status' }).click();
				await page.getByRole('menuitemcheckbox', { name: 'Open' }).click();
				await page.keyboard.press('Escape');

				await filterRequest;
				await expect(page).toHaveURL(new RegExp(`statuses=${encodeURIComponent('["PLANNED","IN_PROGRESS","DONE","REJECTED"]')}`));
				await expect(page.getByText(suggestions[2].description)).toBeVisible();
				await expect(page.getByText(suggestions[0].description)).not.toBeVisible();
			});

			test('sorts suggestions by newest', async ({ page }) => {
				await mockGetProjectSuggestionsRequest(page, project.id, { json: suggestions });

				await page.goto(`/project/${project.id}/suggestions`);

				const sortRequest = page.waitForRequest((request) => {
					const url = new URL(request.url());
					return (
						request.method() === 'GET' &&
						url.pathname === `/api/projects/${project.id}/suggestions` &&
						url.searchParams.get('sortBy') === 'newest'
					);
				});
				await mockGetProjectSuggestionsRequest(page, project.id, { json: [suggestions[2], suggestions[1], suggestions[0]] });
				await page.getByRole('button', { name: 'Newest' }).click();

				await sortRequest;
				await expect(page).toHaveURL(/show=newest/);

				const descriptions = page.locator('p.text-lg span');
				await expect(descriptions.nth(0)).toHaveText(suggestions[2].description);
				await expect(descriptions.nth(1)).toHaveText(suggestions[1].description);
				await expect(descriptions.nth(2)).toHaveText(suggestions[0].description);
			});

			test('shows the empty state when no suggestions match the search', async ({ page }) => {
				await mockGetProjectSuggestionsRequest(page, project.id, { json: suggestions });

				await page.goto(`/project/${project.id}/suggestions`);
				await expect(page.getByPlaceholder('Search...')).toBeVisible();

				const searchRequest = page.waitForRequest((request) => {
					const url = new URL(request.url());
					return (
						request.method() === 'GET' &&
						url.pathname === `/api/projects/${project.id}/suggestions` &&
						url.searchParams.get('search') === 'non-existent'
					);
				});
				await mockGetProjectSuggestionsRequest(page, project.id, { json: [] });
				await page.getByPlaceholder('Search...').fill('non-existent');

				await searchRequest;
				await expect(page.getByText('No suggestions match your search.')).toBeVisible();
			});

			test('preserves filters in the URL across reload/navigation', async ({ page }) => {
				await mockGetProjectSuggestionsRequest(page, project.id, { json: suggestions });

				await page.goto(`/project/${project.id}/suggestions`);
				await expect(page.getByPlaceholder('Search...')).toBeVisible();
				const searchRequest = page.waitForRequest((request) => {
					const url = new URL(request.url());
					return (
						request.method() === 'GET' &&
						url.pathname === `/api/projects/${project.id}/suggestions` &&
						url.searchParams.get('search') === 'billing'
					);
				});
				await mockGetProjectSuggestionsRequest(page, project.id, { json: [suggestions[2]] });
				await page.getByPlaceholder('Search...').fill('billing');
				await searchRequest;

				const categoryRequest = page.waitForRequest((request) => {
					const url = new URL(request.url());
					return (
						request.method() === 'GET' &&
						url.pathname === `/api/projects/${project.id}/suggestions` &&
						url.searchParams.get('search') === 'billing' &&
						url.searchParams.getAll('categories').includes('BUG') &&
						!url.searchParams.getAll('categories').includes('FEATURE')
					);
				});
				await page.getByRole('button', { name: 'Category' }).click();
				await page.getByRole('menuitemcheckbox', { name: 'FEATURE' }).click();
				await page.keyboard.press('Escape');
				await categoryRequest;

				const sortRequest = page.waitForRequest((request) => {
					const url = new URL(request.url());
					return (
						request.method() === 'GET' &&
						url.pathname === `/api/projects/${project.id}/suggestions` &&
						url.searchParams.get('search') === 'billing' &&
						url.searchParams.get('sortBy') === 'newest' &&
						url.searchParams.getAll('categories').includes('BUG') &&
						!url.searchParams.getAll('categories').includes('FEATURE')
					);
				});
				await page.getByRole('button', { name: 'Newest' }).click();
				await sortRequest;

				await page.reload();

				await expect(page).toHaveURL(/search=billing/);
				await expect(page).toHaveURL(new RegExp(`categories=${encodeURIComponent('["BUG"]')}`));
				await expect(page).toHaveURL(/show=newest/);
				await expect(page.getByText(suggestions[2].description)).toBeVisible();
				await expect(page.getByText(suggestions[0].description)).not.toBeVisible();
			});
		});

		test.describe('Voting', () => {
			test('votes on a suggestion with optimistic UI update', async ({ page }) => {
				await mockGetProjectSuggestionsRequest(page, project.id, { json: suggestions });
				const suggestionId = suggestions[1].id;
				await mockVoteSuggestionRequest(page, suggestionId, { status: 200, json: {} });

				await page.goto(`/project/${project.id}/suggestions`);
				await expect(suggestionVoteCount(page, suggestions[1].description)).toHaveText('2');

				await suggestionCard(page, suggestions[1].description).getByRole('button', { name: 'Vote on suggestion' }).click();

				await expect(suggestionVoteCount(page, suggestions[1].description)).toHaveText('3');
				await expect(suggestionCard(page, suggestions[1].description).getByRole('button', { name: 'Remove vote' })).toBeVisible();
			});

			test('removes a vote with optimistic UI update', async ({ page }) => {
				const votedSuggestion = suggestionFactory.build({
					projectId: project.id,
					userId: crypto.randomUUID(),
					description: 'Already voted',
					category: 'FEATURE',
					status: 'OPEN',
					voteCount: 3,
					userHasVoted: true,
				});

				await mockGetProjectSuggestionsRequest(page, project.id, { json: [votedSuggestion] });
				await mockUnvoteSuggestionRequest(page, votedSuggestion.id, { status: 204, body: '' });

				await page.goto(`/project/${project.id}/suggestions`);
				await expect(suggestionVoteCount(page, votedSuggestion.description)).toHaveText('3');

				await suggestionCard(page, votedSuggestion.description).getByRole('button', { name: 'Remove vote' }).click();

				await expect(suggestionVoteCount(page, votedSuggestion.description)).toHaveText('2');
				await expect(suggestionCard(page, votedSuggestion.description).getByRole('button', { name: 'Vote on suggestion' })).toBeVisible();
			});

			test('rolls back the optimistic vote update when the request fails', async ({ page }) => {
				await mockGetProjectSuggestionsRequest(page, project.id, { json: suggestions });
				await mockVoteSuggestionRequest(page, suggestions[1].id, buildApiError('Failed to vote on suggestion'));

				await page.goto(`/project/${project.id}/suggestions`);
				await suggestionCard(page, suggestions[1].description).getByRole('button', { name: 'Vote on suggestion' }).click();

				await expect(suggestionVoteCount(page, suggestions[1].description)).toHaveText('2');
				await expect(suggestionCard(page, suggestions[1].description).getByRole('button', { name: 'Vote on suggestion' })).toBeVisible();
			});
		});

		test.describe('Owner actions', () => {
			test('shows edit and delete actions for the suggestion owner', async ({ page }) => {
				const ownedSuggestion = suggestionFactory.build({
					projectId: project.id,
					userId: regularUser.id,
					description: 'Owned suggestion',
				});
				const otherSuggestion = suggestionFactory.build({
					projectId: project.id,
					userId: crypto.randomUUID(),
					description: 'Someone else suggestion',
				});

				await mockGetProjectSuggestionsRequest(page, project.id, { json: [ownedSuggestion, otherSuggestion] });

				await page.goto(`/project/${project.id}/suggestions`);

				await expect(page.getByRole('button', { name: 'Suggestion actions' })).toHaveCount(1);
				await page.getByRole('button', { name: 'Suggestion actions' }).click();

				await expect(page.getByRole('menuitem', { name: 'Edit' })).toBeVisible();
				await expect(page.getByRole('menuitem', { name: 'Delete' })).toBeVisible();
				await expect(page.getByRole('menuitem', { name: 'Change status' })).toHaveCount(0);
			});

			test('edits an owned suggestion', async ({ page }) => {
				const ownedSuggestion = suggestionFactory.build({
					projectId: project.id,
					userId: regularUser.id,
					description: 'Owned suggestion',
				});
				const updatedSuggestion = {
					...ownedSuggestion,
					description: 'Updated owned suggestion',
					updatedAt: new Date('2026-02-01T10:00:00.000Z').toISOString(),
				};
				await mockGetProjectSuggestionsRequest(page, project.id, { json: [ownedSuggestion] });
				await mockEditSuggestionRequest(page, project.id, ownedSuggestion.id, { json: updatedSuggestion });

				await page.goto(`/project/${project.id}/suggestions`);
				await page.getByRole('button', { name: 'Suggestion actions' }).click();
				await page.getByRole('menuitem', { name: 'Edit' }).click();
				await mockGetProjectSuggestionsRequest(page, project.id, { json: [updatedSuggestion] });
				await page.getByLabel('Description').fill(updatedSuggestion.description);
				await page.getByRole('dialog').getByRole('button', { name: 'Save' }).click();

				await expect(page.getByText('Suggestion updated')).toBeVisible();
				await expect(page.getByText(updatedSuggestion.description)).toBeVisible();
			});

			test('shows an error when editing an owned suggestion fails', async ({ page }) => {
				const ownedSuggestion = suggestionFactory.build({
					projectId: project.id,
					userId: regularUser.id,
					description: 'Owned suggestion',
				});

				await mockGetProjectSuggestionsRequest(page, project.id, { json: [ownedSuggestion] });
				await mockEditSuggestionRequest(page, project.id, ownedSuggestion.id, buildApiError('Failed to update suggestion'));

				await page.goto(`/project/${project.id}/suggestions`);
				await page.getByRole('button', { name: 'Suggestion actions' }).click();
				await page.getByRole('menuitem', { name: 'Edit' }).click();
				await page.getByLabel('Description').fill('Broken edit');
				await page.getByRole('dialog').getByRole('button', { name: 'Save' }).click();

				await expect(page.getByText('Failed to update suggestion')).toBeVisible();
				await expect(page.getByRole('heading', { name: 'Edit suggestion' })).toBeVisible();
				await expect(page.getByLabel('Description')).toHaveValue('Broken edit');
			});

			test('deletes an owned suggestion', async ({ page }) => {
				const ownedSuggestion = suggestionFactory.build({
					projectId: project.id,
					userId: regularUser.id,
					description: 'Owned suggestion',
				});
				await mockGetProjectSuggestionsRequest(page, project.id, { json: [ownedSuggestion] });
				await mockDeleteSuggestionRequest(page, project.id, ownedSuggestion.id, { status: 204, body: '' });

				await page.goto(`/project/${project.id}/suggestions`);
				await page.getByRole('button', { name: 'Suggestion actions' }).click();
				await page.getByRole('menuitem', { name: 'Delete' }).click();
				await mockGetProjectSuggestionsRequest(page, project.id, { json: [] });
				await page.getByRole('button', { name: 'Yes, delete' }).click();

				await expect(page.getByText('Suggestion deleted')).toBeVisible();
				await expect(page.getByText(ownedSuggestion.description)).not.toBeVisible();
			});

			test('shows an error when deleting an owned suggestion fails', async ({ page }) => {
				const ownedSuggestion = suggestionFactory.build({
					projectId: project.id,
					userId: regularUser.id,
					description: 'Owned suggestion',
				});

				await mockGetProjectSuggestionsRequest(page, project.id, { json: [ownedSuggestion] });
				await mockDeleteSuggestionRequest(page, project.id, ownedSuggestion.id, buildApiError('Failed to delete suggestion'));

				await page.goto(`/project/${project.id}/suggestions`);
				await page.getByRole('button', { name: 'Suggestion actions' }).click();
				await page.getByRole('menuitem', { name: 'Delete' }).click();
				await page.getByRole('button', { name: 'Yes, delete' }).click();

				await expect(page.getByText('Failed to delete suggestion')).toBeVisible();
				await expect(page.getByRole('heading', { name: 'Delete suggestion' })).toBeVisible();
				await expect(page.getByText(ownedSuggestion.description)).toBeVisible();
			});
		});

		test.describe('Non-owner permissions', () => {
			test('does not show edit action for suggestions owned by another user', async ({ page }) => {
				const otherSuggestion = suggestionFactory.build({
					projectId: project.id,
					userId: crypto.randomUUID(),
					description: 'Someone else suggestion',
				});

				await mockGetProjectSuggestionsRequest(page, project.id, { json: [otherSuggestion] });

				await page.goto(`/project/${project.id}/suggestions`);

				await expect(page.getByRole('button', { name: 'Suggestion actions' })).toHaveCount(0);
			});

			test('does not show change status action for non-admin users', async ({ page }) => {
				const ownedSuggestion = suggestionFactory.build({
					projectId: project.id,
					userId: regularUser.id,
					description: 'Owned suggestion',
				});

				await mockGetProjectSuggestionsRequest(page, project.id, { json: [ownedSuggestion] });

				await page.goto(`/project/${project.id}/suggestions`);
				await page.getByRole('button', { name: 'Suggestion actions' }).click();

				await expect(page.getByRole('menuitem', { name: 'Edit' })).toBeVisible();
				await expect(page.getByRole('menuitem', { name: 'Delete' })).toBeVisible();
				await expect(page.getByRole('menuitem', { name: 'Change status' })).toHaveCount(0);
			});
		});
	});

	test.describe('When user is authenticated as project admin', () => {
		test.beforeEach(async ({ page }) => {
			await mockGetSessionRequest(page, { user: adminUser, session: adminSession });
			await mockGetProjectRequest(page, project.id, { json: project });
			await mockGetProjectMemberRequest(page, project.id, { json: adminProjectMember });
		});

		test.describe('Admin actions', () => {
			test('shows change status and delete actions for non-owned suggestions', async ({ page }) => {
				const otherSuggestion = suggestionFactory.build({
					projectId: project.id,
					userId: regularUser.id,
					description: 'Someone else suggestion',
				});

				await mockGetProjectSuggestionsRequest(page, project.id, { json: [otherSuggestion] });

				await page.goto(`/project/${project.id}/suggestions`);
				await suggestionCard(page, otherSuggestion.description).getByRole('button', { name: 'Suggestion actions' }).click();

				await expect(page.getByRole('menuitem', { name: 'Change status' })).toBeVisible();
				await expect(page.getByRole('menuitem', { name: 'Delete' })).toBeVisible();
				await expect(page.getByRole('menuitem', { name: 'Edit' })).toHaveCount(0);
			});

			test('changes a suggestion status', async ({ page }) => {
				const otherSuggestion = suggestionFactory.build({
					projectId: project.id,
					userId: regularUser.id,
					description: 'Someone else suggestion',
					status: 'OPEN',
				});
				const updatedSuggestion = { ...otherSuggestion, status: 'PLANNED' as const };

				await mockGetProjectSuggestionsRequest(page, project.id, { json: [otherSuggestion] });
				await mockUpdateSuggestionStatusRequest(page, project.id, otherSuggestion.id, { json: updatedSuggestion });

				await page.goto(`/project/${project.id}/suggestions`);
				await suggestionCard(page, otherSuggestion.description).getByRole('button', { name: 'Suggestion actions' }).click();
				await page.getByRole('menuitem', { name: 'Change status' }).click();

				const dialog = page.getByRole('dialog');
				await dialog.locator('[data-slot="select-trigger"]').click();
				await page.getByRole('option', { name: 'PLANNED' }).click();

				await mockGetProjectSuggestionsRequest(page, project.id, { json: [updatedSuggestion] });
				await dialog.getByRole('button', { name: 'Save' }).click();

				await expect(page.getByText('Status updated')).toBeVisible();
				await expect(suggestionCard(page, updatedSuggestion.description).getByText('PLANNED')).toBeVisible();
			});

			test('changes a suggestion status to rejected with a rejection reason', async ({ page }) => {
				const otherSuggestion = suggestionFactory.build({
					projectId: project.id,
					userId: regularUser.id,
					description: 'Outdated request',
					status: 'OPEN',
				});
				const updatedSuggestion = {
					...otherSuggestion,
					status: 'REJECTED' as const,
					rejectionReason: 'Out of scope',
				};

				await mockGetProjectSuggestionsRequest(page, project.id, { json: [otherSuggestion] });
				await mockUpdateSuggestionStatusRequest(page, project.id, otherSuggestion.id, { json: updatedSuggestion });

				await page.goto(`/project/${project.id}/suggestions`);
				await suggestionCard(page, otherSuggestion.description).getByRole('button', { name: 'Suggestion actions' }).click();
				await page.getByRole('menuitem', { name: 'Change status' }).click();

				const dialog = page.getByRole('dialog');
				await dialog.locator('[data-slot="select-trigger"]').click();
				await page.getByRole('option', { name: 'REJECTED' }).click();
				const rejectionReasonField = dialog.getByPlaceholder('Explain why this suggestion was rejected...');
				await expect(rejectionReasonField).toBeVisible();
				await rejectionReasonField.fill('Out of scope');

				const statusRequest = page.waitForRequest((request) => {
					const url = new URL(request.url());
					if (request.method() !== 'PATCH' || url.pathname !== `/api/projects/${project.id}/suggestions/${otherSuggestion.id}/status`) {
						return false;
					}

					const body = request.postDataJSON() as { status?: string; rejectionReason?: string };
					return body.status === 'REJECTED' && body.rejectionReason === 'Out of scope';
				});

				await mockGetProjectSuggestionsRequest(page, project.id, { json: [updatedSuggestion] });
				await dialog.getByRole('button', { name: 'Save' }).click();

				await statusRequest;
				await expect(page.getByText('Status updated')).toBeVisible();
				await expect(suggestionCard(page, updatedSuggestion.description).getByText('REJECTED')).toBeVisible();
			});

			test('shows an error when status update fails', async ({ page }) => {
				const otherSuggestion = suggestionFactory.build({
					projectId: project.id,
					userId: regularUser.id,
					description: 'Someone else suggestion',
					status: 'OPEN',
				});

				await mockGetProjectSuggestionsRequest(page, project.id, { json: [otherSuggestion] });
				await mockUpdateSuggestionStatusRequest(page, project.id, otherSuggestion.id, buildApiError('Failed to update suggestion status'));

				await page.goto(`/project/${project.id}/suggestions`);
				await suggestionCard(page, otherSuggestion.description).getByRole('button', { name: 'Suggestion actions' }).click();
				await page.getByRole('menuitem', { name: 'Change status' }).click();

				const dialog = page.getByRole('dialog');
				await dialog.locator('[data-slot="select-trigger"]').click();
				await page.getByRole('option', { name: 'PLANNED' }).click();
				await dialog.getByRole('button', { name: 'Save' }).click();

				await expect(page.getByText('Failed to update suggestion status')).toBeVisible();
				await expect(page.getByRole('heading', { name: 'Change status' })).toBeVisible();
				await expect(suggestionCard(page, otherSuggestion.description).getByText('OPEN')).toBeVisible();
			});

			test('deletes a suggestion owned by another user', async ({ page }) => {
				const otherSuggestion = suggestionFactory.build({
					projectId: project.id,
					userId: regularUser.id,
					description: 'Someone else suggestion',
				});

				await mockGetProjectSuggestionsRequest(page, project.id, { json: [otherSuggestion] });
				await mockDeleteSuggestionRequest(page, project.id, otherSuggestion.id);

				await page.goto(`/project/${project.id}/suggestions`);
				await suggestionCard(page, otherSuggestion.description).getByRole('button', { name: 'Suggestion actions' }).click();
				await page.getByRole('menuitem', { name: 'Delete' }).click();

				await mockGetProjectSuggestionsRequest(page, project.id, { json: [] });
				await page.getByRole('button', { name: 'Yes, delete' }).click();

				await expect(page.getByText('Suggestion deleted')).toBeVisible();
				await expect(page.getByRole('heading', { name: 'No suggestions created' })).toBeVisible();
			});

			test('shows an error when deleting another users suggestion fails', async ({ page }) => {
				const otherSuggestion = suggestionFactory.build({
					projectId: project.id,
					userId: regularUser.id,
					description: 'Someone else suggestion',
				});

				await mockGetProjectSuggestionsRequest(page, project.id, { json: [otherSuggestion] });
				await mockDeleteSuggestionRequest(page, project.id, otherSuggestion.id, buildApiError('Failed to delete suggestion'));

				await page.goto(`/project/${project.id}/suggestions`);
				await suggestionCard(page, otherSuggestion.description).getByRole('button', { name: 'Suggestion actions' }).click();
				await page.getByRole('menuitem', { name: 'Delete' }).click();
				await page.getByRole('button', { name: 'Yes, delete' }).click();

				await expect(page.getByText('Failed to delete suggestion')).toBeVisible();
				await expect(page.getByRole('heading', { name: 'Delete suggestion' })).toBeVisible();
				await expect(suggestionCard(page, otherSuggestion.description)).toBeVisible();
			});
		});

		test.describe('Admin + owner overlap', () => {
			test('shows change status, edit, and delete actions for an admin-owned suggestion', async ({ page }) => {
				const ownedSuggestion = suggestionFactory.build({
					projectId: project.id,
					userId: adminUser.id,
					description: 'Admin owned suggestion',
				});

				await mockGetProjectSuggestionsRequest(page, project.id, { json: [ownedSuggestion] });

				await page.goto(`/project/${project.id}/suggestions`);
				await suggestionCard(page, ownedSuggestion.description).getByRole('button', { name: 'Suggestion actions' }).click();

				await expect(page.getByRole('menuitem', { name: 'Change status' })).toBeVisible();
				await expect(page.getByRole('menuitem', { name: 'Edit' })).toBeVisible();
				await expect(page.getByRole('menuitem', { name: 'Delete' })).toBeVisible();
			});
		});
	});
});
