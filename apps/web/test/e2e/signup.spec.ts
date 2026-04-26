import { expect, test } from '@playwright/test';
import { buildApiError, mockGetProjectsRequest, mockGetSessionRequest, mockSignUpEmailRequest } from './helpers/api-requests';
import { sessionFactory, userFactory } from './helpers/factories';

const user = userFactory.build({ email: 'signup@example.com', name: 'Signup User' });
const session = sessionFactory.build({ userId: user.id });

test.describe('Signup page', () => {
	test.describe('When user is unauthenticated', () => {
		test.beforeEach(async ({ page }) => {
			await mockGetSessionRequest(page, null);
		});

		test('renders the signup form', async ({ page }) => {
			await page.goto('/auth/signup');

			await expect(page.getByText('Create an account')).toBeVisible();
			await expect(page.getByLabel('Name')).toBeVisible();
			await expect(page.getByLabel('Email')).toBeVisible();
			await expect(page.getByLabel('Password', { exact: true })).toBeVisible();
			await expect(page.getByLabel('Confirm Password', { exact: true })).toBeVisible();
			await expect(page.getByRole('button', { name: 'Create account' })).toBeVisible();
		});

		test('shows client validation errors', async ({ page }) => {
			await page.goto('/auth/signup');
			await page.getByRole('button', { name: 'Create account' }).click();

			await expect(page.getByText('Name is required')).toBeVisible();
			await expect(page.getByText('Email is required')).toBeVisible();
			await expect(page.getByText('Password must be at least 8 characters')).toBeVisible();
			await expect(page.getByText('Please confirm your password')).toBeVisible();
		});

		test('shows a password mismatch validation error', async ({ page }) => {
			await page.goto('/auth/signup');
			await page.getByLabel('Name').fill(user.name);
			await page.getByLabel('Email').fill(user.email);
			await page.getByLabel('Password', { exact: true }).fill('password123');
			await page.getByLabel('Confirm Password', { exact: true }).fill('different123');
			await page.getByRole('button', { name: 'Create account' }).click();

			await expect(page.getByText('Passwords do not match')).toBeVisible();
		});

		test('shows a generic signup server error', async ({ page }) => {
			await mockSignUpEmailRequest(page, buildApiError('User already exists', 409));

			await page.goto('/auth/signup');
			await page.getByLabel('Name').fill(user.name);
			await page.getByLabel('Email').fill(user.email);
			await page.getByLabel('Password', { exact: true }).fill('password123');
			await page.getByLabel('Confirm Password', { exact: true }).fill('password123');
			await page.getByRole('button', { name: 'Create account' }).click();

			await expect(page.getByText('User already exists')).toBeVisible();
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
