import { test, expect } from '@playwright/test';
import { sessionFactory, userFactory } from './helpers/factories';
import { mockGetProjectsRequest, mockGetSessionRequest } from './helpers/api-requests';

test.describe('Landing page', () => {
	test.describe('When user is signed out', () => {
		test.beforeEach(async ({ page }) => {
			await mockGetSessionRequest(page, null);
		});

		test('loads and displays key content', async ({ page }) => {
			await page.goto('/');
			await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
			await expect(page.locator('#hero').getByRole('link', { name: 'Get started' })).toBeVisible();
			await expect(page.locator('header').getByRole('link', { name: 'Log in' })).toBeVisible();
			await expect(page.locator('header').getByRole('link', { name: 'Sign up' })).toBeVisible();
		});

		test('navigates to signup from hero CTA', async ({ page }) => {
			await page.goto('/');
			await page.locator('#hero').getByRole('link', { name: 'Get started' }).click();
			await expect(page).toHaveURL('/auth/signup');
		});

		test('navigates to signup from header', async ({ page }) => {
			await page.goto('/');
			await page.locator('header').getByRole('link', { name: 'Sign up' }).click();
			await expect(page).toHaveURL('/auth/signup');
		});

		test('navigates to login from header', async ({ page }) => {
			await page.goto('/');
			await page.locator('header').getByRole('link', { name: 'Log in' }).click();
			await expect(page).toHaveURL('/auth/login');
		});

		test('navigates to login from hero', async ({ page }) => {
			await page.goto('/');
			await page.locator('#hero').getByRole('link', { name: 'Log in' }).click();
			await expect(page).toHaveURL('/auth/login');
		});

		test('header shows anchor navigation links', async ({ page }) => {
			await page.goto('/');
			const header = page.locator('header');
			await expect(header.getByRole('link', { name: 'Features' })).toHaveAttribute('href', '#features');
			await expect(header.getByRole('link', { name: 'How it works' })).toHaveAttribute('href', '#how-it-works');
			await expect(header.getByRole('link', { name: 'Solution' })).toHaveAttribute('href', '#scattered-feedback');
			await expect(header.getByRole('link', { name: 'Use cases' })).toHaveAttribute('href', '#use-cases');
		});

		test('footer shows product and use case links', async ({ page }) => {
			await page.goto('/');
			const footer = page.locator('footer');
			await expect(footer.getByText('Product')).toBeVisible();
			await expect(footer.getByRole('link', { name: 'Features' })).toHaveAttribute('href', '#features');
			await expect(footer.getByRole('link', { name: 'How it works' })).toHaveAttribute('href', '#how-it-works');
			await expect(footer.getByRole('link', { name: 'Centralize feedback' })).toHaveAttribute('href', '#scattered-feedback');

			await expect(footer.locator('div').filter({ hasText: /^Use cases$/ })).toBeVisible();
			await expect(footer.getByRole('link', { name: 'For SaaS companies' })).toBeVisible();
			await expect(footer.getByRole('link', { name: 'For indie makers' })).toBeVisible();
			await expect(footer.getByRole('link', { name: 'For open source projects' })).toBeVisible();
			await expect(footer.getByRole('link', { name: 'For agencies & consultants' })).toBeVisible();
		});

		test('all landing page sections are present', async ({ page }) => {
			await page.goto('/');
			await expect(page.locator('#features')).toBeVisible();
			await expect(page.locator('#how-it-works')).toBeVisible();
			await expect(page.locator('#scattered-feedback')).toBeVisible();
			await expect(page.locator('#use-cases')).toBeVisible();
			await expect(page.locator('#get-started')).toBeVisible();
		});
	});

	test.describe('When user is signed in', () => {
		const user = userFactory.build();
		const session = sessionFactory.build({ userId: user.id });

		test.beforeEach(async ({ page }) => {
			await mockGetSessionRequest(page, { user, session });
		});

		test('shows signed-in header links instead of auth links', async ({ page }) => {
			await page.goto('/');

			const header = page.locator('header');
			await expect(header.getByRole('link', { name: 'Projects' })).toBeVisible();
			await expect(header.getByRole('link', { name: 'Account' })).toBeVisible();
			await expect(header.getByRole('link', { name: 'Log in' })).not.toBeVisible();
			await expect(header.getByRole('link', { name: 'Sign up' })).not.toBeVisible();
		});

		test('navigates to projects from the header', async ({ page }) => {
			await mockGetProjectsRequest(page, []);

			await page.goto('/');
			await page.locator('header').getByRole('link', { name: 'Projects' }).click();

			await expect(page).toHaveURL('/projects');
		});

		test('navigates to account from the header', async ({ page }) => {
			await page.goto('/');
			await page.locator('header').getByRole('link', { name: 'Account' }).click();

			await expect(page).toHaveURL('/account');
			await expect(page.getByRole('heading', { name: 'Account details' })).toBeVisible();
			await expect(page.getByText(user.name)).toBeVisible();
		});
	});
});
