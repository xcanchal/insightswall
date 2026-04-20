import { test, expect } from '@playwright/test';

test.describe('Landing page', () => {
	test('loads and displays key content', async ({ page }) => {
		await page.goto('/');
		await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
		await expect(page.getByRole('link', { name: 'Get started' })).toBeVisible();
		await expect(page.getByRole('banner').getByRole('link', { name: 'Log in' })).toBeVisible();
	});

	test('navigates to signup from hero CTA', async ({ page }) => {
		await page.goto('/');
		await page.getByRole('link', { name: 'Get started' }).click();
		await expect(page).toHaveURL('/auth/signup');
	});

	test('navigates to signup from header', async ({ page }) => {
		await page.goto('/');
		await page.getByRole('banner').getByRole('link', { name: 'Sign up' }).click();
		await expect(page).toHaveURL('/auth/signup');
	});

	test('navigates to login from header', async ({ page }) => {
		await page.goto('/');
		await page.getByRole('banner').getByRole('link', { name: 'Log in' }).click();
		await expect(page).toHaveURL('/auth/login');
	});

	test('navigates to login from hero', async ({ page }) => {
		await page.goto('/');
		await page.getByRole('main').getByRole('link', { name: 'Log in' }).click();
		await expect(page).toHaveURL('/auth/login');
	});
});
