import { expect, test } from '@playwright/test';
import { mockGetProjectsRequest, mockGetSessionRequest, mockSignUpEmailRequest } from './helpers/api-requests';
import { sessionFactory, userFactory } from './helpers/factories';

const user = userFactory.build({ email: 'signup@example.com', name: 'Signup User' });
const session = sessionFactory.build({ userId: user.id });

test.describe('Signup page', () => {
	test.describe('When user is unauthenticated', () => {
		test.beforeEach(async ({ page }) => {
			await mockGetSessionRequest(page, null);
		});

		test('redirects to verify-email after successful signup', async ({ page }) => {
			await mockSignUpEmailRequest(page, { json: { user, session } });

			await page.goto('/auth/signup');
			await page.getByLabel('Name').fill(user.name);
			await page.getByLabel('Email').fill(user.email);
			await page.getByLabel('Password', { exact: true }).fill('password123');
			await page.getByLabel('Confirm Password', { exact: true }).fill('password123');
			await page.getByRole('button', { name: 'Create account' }).click();

			await expect(page).toHaveURL('/auth/verify-email');
			await expect(page.getByText('Verify your email address', { exact: true })).toBeVisible();
		});
	});

	test('redirects authenticated users away from signup', async ({ page }) => {
		await mockGetSessionRequest(page, { user, session });
		await mockGetProjectsRequest(page, { json: [] });

		await page.goto('/auth/signup');

		await expect(page).toHaveURL('/projects');
		await expect(page.getByRole('heading', { name: 'No projects found' })).toBeVisible();
	});
});
