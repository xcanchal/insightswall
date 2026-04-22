import { test, expect } from '@playwright/test';

const WIDGET_URL = 'http://localhost:5173/widget.js';
const PROJECT_ID = 'test-project-id';

function widgetHtml(attrs: string = '') {
	return `<!doctype html><html><body><script src="${WIDGET_URL}" data-project="${PROJECT_ID}" ${attrs}></script></body></html>`;
}

test.describe('Widget', () => {
	test('renders a floating feedback button', async ({ page }) => {
		await page.setContent(widgetHtml());

		const btn = page.getByRole('button', { name: 'Send feedback' });
		await expect(btn).toBeVisible();
		await expect(btn).toHaveText('💡 Feedback');
	});

	test('opens suggestions page in a new tab on click', async ({ page, context }) => {
		await page.setContent(widgetHtml());

		const [newPage] = await Promise.all([context.waitForEvent('page'), page.getByRole('button', { name: 'Send feedback' }).click()]);

		await newPage.waitForLoadState();
		expect(newPage.url()).toContain(`/project/${PROJECT_ID}/suggestions`);
	});

	test('supports custom label via data-label', async ({ page }) => {
		await page.setContent(widgetHtml('data-label="Send feedback!"'));

		const btn = page.getByRole('button', { name: 'Send feedback' });
		await expect(btn).toHaveText('Send feedback!');
	});

	test('supports custom background color via data-color', async ({ page }) => {
		await page.setContent(widgetHtml('data-color="#2563eb"'));

		const btn = page.getByRole('button', { name: 'Send feedback' });
		await expect(btn).toHaveCSS('background-color', 'rgb(37, 99, 235)');
	});

	test('does not render button when data-project is missing', async ({ page }) => {
		await page.setContent(`<!doctype html><html><body><script src="${WIDGET_URL}"></script></body></html>`);

		const btn = page.getByRole('button', { name: 'Send feedback' });
		await expect(btn).not.toBeVisible();
	});
});
