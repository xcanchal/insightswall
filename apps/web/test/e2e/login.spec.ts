import { expect, test } from '@playwright/test';
import { buildApiError, mockGetProjectsRequest, mockGetSessionRequest, mockSignInEmailRequest } from './helpers/api-requests';
import { sessionFactory, userFactory } from './helpers/factories';

const user = userFactory.build({ email: 'user@example.com' });
const session = sessionFactory.build({ userId: user.id });

test.describe('Login page', () => {
	test.describe('When user is unauthenticated', () => {
		test.beforeEach(async ({ page }) => {
			await mockGetSessionRequest(page, null);
		});

		test('redirects to projects after successful login', async ({ page }) => {
			await mockSignInEmailRequest(page, { json: { user, session } });
			await mockGetProjectsRequest(page, { json: [] });

			await page.goto('/auth/login');
			await page.getByLabel('Email').fill(user.email);
			await page.getByLabel('Password', { exact: true }).fill('password123');
			await mockGetSessionRequest(page, { user, session });
			await page.getByRole('button', { name: 'Log in' }).click();

			await expect(page).toHaveURL('/projects');
			await expect(page.getByRole('heading', { name: 'No projects found' })).toBeVisible();
		});

		test('shows the unverified email view if user did not verify it', async ({ page }) => {
			await mockSignInEmailRequest(page, buildApiError('Email not verified', 403));

			await page.goto('/auth/login');
			await page.getByLabel('Email').fill(user.email);
			await page.getByLabel('Password', { exact: true }).fill('password123');
			await page.getByRole('button', { name: 'Log in' }).click();

			await expect(page.getByText('Please verify your email address before signing in.')).toBeVisible();
		});
	});

	test('redirects authenticated users away from login', async ({ page }) => {
		await mockGetSessionRequest(page, { user, session });
		await mockGetProjectsRequest(page, { json: [] });

		await page.goto('/auth/login');

		await expect(page).toHaveURL('/projects');
		await expect(page.getByRole('heading', { name: 'No projects found' })).toBeVisible();
	});
});
