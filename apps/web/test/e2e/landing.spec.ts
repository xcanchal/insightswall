import { test, expect } from '@playwright/test';

test.describe('Landing page', () => {
	test('loads and displays key content', async ({ page }) => {
		await page.goto('/');
		await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
		await expect(page.locator('#hero').getByRole('link', { name: 'Get started' })).toBeVisible();
		await expect(page.locator('header').getByRole('link', { name: 'Log in' })).toBeVisible();
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
		await expect(header.getByRole('link', { name: 'Centralization' })).toHaveAttribute('href', '#scattered-feedback');
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
