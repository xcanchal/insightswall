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
			await mockGetProjectsRequest(page, { json: [] });

			await page.goto('/projects');

			await expect(page).toHaveURL('/auth/login');
		});
	});

	test.describe('When user is authenticated', () => {
		const user = userFactory.build();
		const session = sessionFactory.build({ userId: user.id });

		test.beforeEach(async ({ page }) => {
			await mockGetSessionRequest(page, { user, session });
		});

		test.describe('Project list', () => {
			test('shows the empty state', async ({ page }) => {
				await mockGetProjectsRequest(page, { json: [] });

				await page.goto('/projects');

				await expect(page.getByRole('heading', { name: 'No projects found' })).toBeVisible();
				await expect(page.getByText('Create a new project to get started')).toBeVisible();
				await expect(page.getByRole('button', { name: 'Create project' }).first()).toBeVisible();
			});

			test('renders the projects list', async ({ page }) => {
				const projects = [projectFactory.build({ name: 'Project Name 1' }), projectFactory.build({ name: 'Project Name 2' })];
				await mockGetProjectsRequest(page, { json: projects });

				await page.goto('/projects');
				await expect(page.getByRole('heading', { name: projects[0].name })).toBeVisible();
				await expect(page.getByRole('heading', { name: projects[1].name })).toBeVisible();
			});

			test('shows an error state when loading projects fails', async ({ page }) => {
				await mockGetProjectsRequest(page, {
					status: 500,
					json: { error: 'InternalServerError', message: 'Failed to load projects', statusCode: 500 },
				});

				await page.goto('/projects');

				await expect(page.getByText('Failed to load projects')).toBeVisible({ timeout: 15000 });
			});
		});

		test.describe('Create project', () => {
			test('creates a project and redirects to suggestions page', async ({ page }) => {
				const project = projectFactory.build();
				await mockGetProjectsRequest(page, { json: [] });

				await page.goto('/projects');
				await page.getByRole('button', { name: 'Create project' }).first().click();

				const projectMember = projectMemberFactory.build({ projectId: project.id, userId: user.id });
				await mockCreateProjectRequest(page, { status: 201, json: project });
				await mockGetProjectRequest(page, project.id, { json: project });
				await mockGetProjectMemberRequest(page, project.id, { json: projectMember });
				await mockGetProjectSuggestionsRequest(page, project.id, { json: [] });

				await page.getByLabel('Project name').fill(project.name);
				await page.getByLabel('Website URL (optional)').fill(project.url!);
				await page
					.getByRole('dialog')
					.getByRole('button', { name: /^Create project$/ })
					.click();

				await expect(page).toHaveURL(`/project/${project.id}/suggestions`);
			});

			test('does not submit the form with invalid values', async ({ page }) => {
				await mockGetProjectsRequest(page, { json: [] });

				await page.goto('/projects');
				await page.getByRole('button', { name: 'Create project' }).first().click();
				await page
					.getByRole('dialog')
					.getByRole('button', { name: /^Create project$/ })
					.click();

				await expect(page.getByText('Name is required')).toBeVisible();

				await page.getByLabel('Project name').fill('x'.repeat(51));
				await page.getByLabel('Website URL (optional)').fill('not-a-url');
				await page
					.getByRole('dialog')
					.getByRole('button', { name: /^Create project$/ })
					.click();

				await expect(page.getByText('Name must be at most 50 characters')).toBeVisible();
				await expect(page.getByText('Must be a valid URL')).toBeVisible();
			});

			test('shows an error when project creation fails', async ({ page }) => {
				await mockGetProjectsRequest(page, { json: [] });
				await mockCreateProjectRequest(page, {
					status: 500,
					json: { error: 'InternalServerError', message: 'Failed to create project', statusCode: 500 },
				});

				await page.goto('/projects');
				await page.getByRole('button', { name: 'Create project' }).first().click();
				await page.getByLabel('Project name').fill('New project');
				await page.getByLabel('Website URL (optional)').fill('https://new-project.test');
				await page
					.getByRole('dialog')
					.getByRole('button', { name: /^Create project$/ })
					.click();

				await expect(page).toHaveURL('/projects');
				await expect(page.getByText('Failed to create project')).toBeVisible();
				await expect(page.getByRole('heading', { name: 'Create a project' })).toBeVisible();
			});
		});

		test.describe('Edit project', () => {
			test('edits a project name and url', async ({ page }) => {
				const project = projectFactory.build();
				await mockGetProjectsRequest(page, { json: [project] });

				await page.goto('/projects');
				await page.locator('div.group').filter({ hasText: project.name }).getByRole('button').click();
				await page.getByRole('menuitem', { name: 'Edit' }).click();

				const updatedProject = { ...project, name: 'New Name', url: 'https://new-name.test' };
				await mockUpdateProjectRequest(page, project.id, { json: updatedProject });
				await mockGetProjectsRequest(page, { json: [updatedProject] });
				await mockGetProjectRequest(page, project.id, { json: updatedProject });

				await page.getByLabel('Project name').fill(updatedProject.name);
				await page.getByLabel('Website URL (optional)').fill(updatedProject.url);
				await page.getByRole('button', { name: 'Save' }).click();

				await expect(page.getByRole('heading', { name: updatedProject.name })).toBeVisible();
			});

			test('shows an error when project update fails', async ({ page }) => {
				const project = projectFactory.build();
				await mockGetProjectsRequest(page, { json: [project] });
				await mockUpdateProjectRequest(page, project.id, {
					status: 500,
					json: { error: 'InternalServerError', message: 'Failed to update project', statusCode: 500 },
				});

				await page.goto('/projects');
				await page.locator('div.group').filter({ hasText: project.name }).getByRole('button').click();
				await page.getByRole('menuitem', { name: 'Edit' }).click();
				await page.getByLabel('Project name').fill('Broken update');
				await page.getByRole('button', { name: 'Save' }).click();

				await expect(page.getByText('Failed to update project')).toBeVisible();
				await expect(page.getByRole('heading', { name: 'Edit project' })).toBeVisible();
				await expect(page.getByLabel('Project name')).toHaveValue('Broken update');
			});

			test('does not submit an invalid url while editing', async ({ page }) => {
				const project = projectFactory.build();
				await mockGetProjectsRequest(page, { json: [project] });

				await page.goto('/projects');
				await page.locator('div.group').filter({ hasText: project.name }).getByRole('button').click();
				await page.getByRole('menuitem', { name: 'Edit' }).click();
				await page.getByLabel('Website URL (optional)').fill('not-a-url');
				await page.getByRole('button', { name: 'Save' }).click();

				await expect(page.getByText('Must be a valid URL')).toBeVisible();
				await expect(page.getByRole('heading', { name: 'Edit project' })).toBeVisible();
			});
		});

		test.describe('Delete project', () => {
			test('deletes a project', async ({ page }) => {
				const project = projectFactory.build();
				await mockGetProjectsRequest(page, { json: [project] });

				await page.goto('/projects');
				await page.locator('div.group').filter({ hasText: project.name }).getByRole('button').click();

				await mockDeleteProjectRequest(page, project.id, { status: 204, body: '' });
				await mockGetProjectsRequest(page, { json: [] });

				await page.getByRole('menuitem', { name: 'Delete' }).click();
				await page.getByRole('button', { name: 'Yes, delete' }).click();

				await expect(page.getByRole('heading', { name: 'No projects found' })).toBeVisible();
			});

			test('shows an error when project deletion fails', async ({ page }) => {
				const project = projectFactory.build();
				await mockGetProjectsRequest(page, { json: [project] });
				await mockDeleteProjectRequest(page, project.id, {
					status: 500,
					json: { error: 'InternalServerError', message: 'Failed to delete project', statusCode: 500 },
				});

				await page.goto('/projects');
				await page.locator('div.group').filter({ hasText: project.name }).getByRole('button').click();
				await page.getByRole('menuitem', { name: 'Delete' }).click();
				await page.getByRole('button', { name: 'Yes, delete' }).click();

				await expect(page.getByText('Failed to delete project')).toBeVisible();
				await expect(page.getByRole('heading', { name: 'Delete project' })).toBeVisible();
				await expect(page.getByRole('dialog')).toContainText(project.name);
			});
		});
	});
});
