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

		test('renders the login form', async ({ page }) => {
			await page.goto('/auth/login');

			await expect(page.getByText('Log in to your account')).toBeVisible();
			await expect(page.getByLabel('Email')).toBeVisible();
			await expect(page.getByLabel('Password', { exact: true })).toBeVisible();
			await expect(page.getByRole('button', { name: 'Log in' })).toBeVisible();
		});

		test('shows client validation errors', async ({ page }) => {
			await page.goto('/auth/login');
			await page.getByRole('button', { name: 'Log in' }).click();

			await expect(page.getByText('Email is required')).toBeVisible();
			await expect(page.getByText('Password is required')).toBeVisible();
		});

		test('shows an invalid email validation error', async ({ page }) => {
			await page.goto('/auth/login');
			await page.getByLabel('Email').fill('not-an-email');
			await page.getByLabel('Password').fill('password123');
			await page.getByRole('button', { name: 'Log in' }).click();

			await expect(page.getByText('Invalid email address')).toBeVisible();
		});

		test('shows a generic server error', async ({ page }) => {
			await mockSignInEmailRequest(page, buildApiError('Invalid email or password', 401));

			await page.goto('/auth/login');
			await page.getByLabel('Email').fill(user.email);
			await page.getByLabel('Password', { exact: true }).fill('wrong-password');
			await page.getByRole('button', { name: 'Log in' }).click();

			await expect(page.getByText('Invalid email or password')).toBeVisible();
		});

		test('shows the unverified email message when sign-in is forbidden', async ({ page }) => {
			await mockSignInEmailRequest(page, buildApiError('Email not verified', 403));

			await page.goto('/auth/login');
			await page.getByLabel('Email').fill(user.email);
			await page.getByLabel('Password', { exact: true }).fill('password123');
			await page.getByRole('button', { name: 'Log in' }).click();

			await expect(page.getByText('Please verify your email address before signing in.')).toBeVisible();
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
	});

	test('redirects authenticated users away from login', async ({ page }) => {
		await mockGetSessionRequest(page, { user, session });
		await mockGetProjectsRequest(page, { json: [] });

		await page.goto('/auth/login');

		await expect(page).toHaveURL('/projects');
		await expect(page.getByRole('heading', { name: 'No projects found' })).toBeVisible();
	});
});
