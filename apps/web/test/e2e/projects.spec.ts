import { test, expect } from '@playwright/test';
import { sessionFactory, projectFactory, projectMemberFactory, userFactory } from './helpers/factories';
import {
	mockCreateProjectRequest,
	mockGetProjectRequest,
	mockGetProjectsRequest,
	mockGetSessionRequest,
	mockGetProjectSuggestionsRequest,
	mockGetProjectMemberRequest,
	mockUpdateProjectRequest,
	mockDeleteProjectRequest,
} from './helpers/api-requests';

test.describe('Projects page', () => {
	test.describe('When user is unauthenticated', () => {
		test.beforeEach(async ({ page }) => {
			await mockGetSessionRequest(page, null);
		});

		test('redirects unauthenticated users to login', async ({ page }) => {
			await mockGetProjectsRequest(page, []);

			await page.goto('/projects');

			await expect(page).toHaveURL('/auth/login');
		});
	});

	test.describe('When user is authenticated', () => {
		const user = userFactory.build();
		const session = sessionFactory.build({ userId: user.id });

		test.beforeEach(async ({ page }) => {
			await mockGetSessionRequest(page, session);
		});

		test('shows the empty state', async ({ page }) => {
			await mockGetProjectsRequest(page, []);

			await page.goto('/projects');

			await expect(page.getByRole('heading', { name: 'No projects found' })).toBeVisible();
			await expect(page.getByText('Create a new project to get started')).toBeVisible();
			await expect(page.getByRole('button', { name: 'Create project' }).first()).toBeVisible();
		});

		test('renders the projects list', async ({ page }) => {
			const projects = [projectFactory.build({ name: 'Project Name 1' }), projectFactory.build({ name: 'Project Name 2' })];
			await mockGetProjectsRequest(page, projects);

			await page.goto('/projects');
			await expect(page.getByRole('heading', { name: projects[0].name })).toBeVisible();
			await expect(page.getByRole('heading', { name: projects[1].name })).toBeVisible();
		});

		test('creates a project and redirects to suggestions page', async ({ page }) => {
			const project = projectFactory.build();
			await mockGetProjectsRequest(page, []);

			await page.goto('/projects');
			await page.getByRole('button', { name: 'Create project' }).first().click();

			const projectMember = projectMemberFactory.build({ projectId: project.id, userId: user.id });
			await mockCreateProjectRequest(page, project);
			await mockGetProjectRequest(page, project.id, project);
			await mockGetProjectMemberRequest(page, project.id, projectMember);
			await mockGetProjectSuggestionsRequest(page, project.id, []);

			await page.getByLabel('Project name').fill(project.name);
			await page.getByLabel('Website URL (optional)').fill(project.url!);
			await page
				.getByRole('dialog')
				.getByRole('button', { name: /^Create project$/ })
				.click();

			await expect(page).toHaveURL(`/project/${project.id}/suggestions`);
		});

		test('edits a project', async ({ page }) => {
			const project = projectFactory.build();
			await mockGetProjectsRequest(page, [project]);

			await page.goto('/projects');
			await page.locator('div.group').filter({ hasText: project.name }).getByRole('button').click();
			await page.getByRole('menuitem', { name: 'Edit' }).click();

			const updatedProject = { ...project, name: 'New Name' };
			await mockUpdateProjectRequest(page, project.id, updatedProject);
			await mockGetProjectsRequest(page, [updatedProject]);
			await mockGetProjectRequest(page, project.id, updatedProject);

			await page.getByLabel('Project name').fill(updatedProject.name);
			await page.getByRole('button', { name: 'Save' }).click();

			await expect(page.getByRole('heading', { name: updatedProject.name })).toBeVisible();
		});

		test('deletes a project', async ({ page }) => {
			const project = projectFactory.build();
			await mockGetProjectsRequest(page, [project]);

			await page.goto('/projects');
			await page.locator('div.group').filter({ hasText: project.name }).getByRole('button').click();

			await mockDeleteProjectRequest(page, project.id);
			await mockGetProjectsRequest(page, []);

			await page.getByRole('menuitem', { name: 'Delete' }).click();
			await page.getByRole('button', { name: 'Yes, delete' }).click();

			await expect(page.getByRole('heading', { name: 'No projects found' })).toBeVisible();
		});
	});
});
