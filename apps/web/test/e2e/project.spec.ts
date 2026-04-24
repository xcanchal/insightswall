import { test, expect } from '@playwright/test';
import { projectFactory, projectMemberFactory, sessionFactory, userFactory } from './helpers/factories';
import {
	mockGetProjectMemberRequest,
	mockGetProjectRequest,
	mockGetProjectsRequest,
	mockGetProjectSuggestionsRequest,
	mockGetSessionRequest,
} from './helpers/api-requests';

test.describe('Project shell', () => {
	const user = userFactory.build();
	const session = sessionFactory.build({ userId: user.id });

	test.describe('When user is authenticated', () => {
		test.beforeEach(async ({ page }) => {
			await mockGetSessionRequest(page, { user, session });
		});

		test('redirects to projects when the project does not exist', async ({ page }) => {
			const missingProjectId = 'missing-project';

			await mockGetProjectRequest(page, missingProjectId, {
				status: 404,
				json: { error: 'NotFound', message: 'Project not found', statusCode: 404 },
			});
			await mockGetProjectMemberRequest(page, missingProjectId, {
				json: projectMemberFactory.build({ projectId: missingProjectId, userId: user.id }),
			});
			await mockGetProjectSuggestionsRequest(page, missingProjectId, { json: [] });
			await mockGetProjectsRequest(page, { json: [] });

			await page.goto(`/project/${missingProjectId}/suggestions`);

			await expect(page).toHaveURL('/projects', { timeout: 15000 });
		});

		test('navigates between shared suggestions and roadmap tabs', async ({ page }) => {
			const project = projectFactory.build();
			const projectMember = projectMemberFactory.build({ projectId: project.id, userId: user.id, role: 'USER' });

			await mockGetProjectRequest(page, project.id, { json: project });
			await mockGetProjectMemberRequest(page, project.id, { json: projectMember });
			await mockGetProjectSuggestionsRequest(page, project.id, { json: [] });

			await page.goto(`/project/${project.id}/suggestions`);
			await page.getByRole('link', { name: 'Roadmap' }).click();

			await expect(page).toHaveURL(`/project/${project.id}/roadmap`);
			await expect(page.getByRole('link', { name: 'Suggestions' })).toBeVisible();
			await expect(page.getByRole('link', { name: 'Roadmap' })).toBeVisible();

			await page.getByRole('link', { name: 'Suggestions' }).click();
			await expect(page).toHaveURL(`/project/${project.id}/suggestions`);
		});

		test.describe('When user is authenticated as non-admin', () => {
			test('renders the shared project header without admin controls', async ({ page }) => {
				const project = projectFactory.build({ name: 'Customer Portal' });
				const projectMember = projectMemberFactory.build({ projectId: project.id, userId: user.id, role: 'USER' });

				await mockGetProjectRequest(page, project.id, { json: project });
				await mockGetProjectMemberRequest(page, project.id, { json: projectMember });
				await mockGetProjectSuggestionsRequest(page, project.id, { json: [] });

				await page.goto(`/project/${project.id}/suggestions`);

				await expect(page.getByRole('heading', { name: project.name })).toBeVisible();
				await expect(page.getByRole('link', { name: 'Suggestions' })).toBeVisible();
				await expect(page.getByRole('link', { name: 'Roadmap' })).toBeVisible();
				await expect(page.getByRole('button', { name: 'Embed widget' })).not.toBeVisible();
			});
		});

		test.describe('When user is authenticated as admin', () => {
			test('renders admin controls and opens the widget dialog', async ({ page }) => {
				const project = projectFactory.build({ name: 'Admin Portal' });
				const otherProject = projectFactory.build({ name: 'Backoffice' });
				const projectMember = projectMemberFactory.build({ projectId: project.id, userId: user.id, role: 'ADMIN' });

				await mockGetProjectsRequest(page, { json: [project, otherProject] });
				await mockGetProjectRequest(page, project.id, { json: project });
				await mockGetProjectMemberRequest(page, project.id, { json: projectMember });
				await mockGetProjectSuggestionsRequest(page, project.id, { json: [] });

				await page.goto(`/project/${project.id}/suggestions`);

				await expect(page.getByRole('button', { name: project.name })).toBeVisible();
				await expect(page.getByRole('button', { name: 'Embed widget' })).toBeVisible();

				await page.getByRole('button', { name: 'Embed widget' }).click();

				await expect(page.getByRole('heading', { name: 'Embed widget' })).toBeVisible();
				await expect(page.getByText(project.id)).toBeVisible();
				await expect(page.getByRole('button', { name: 'Copy snippet' })).toBeVisible();
			});

			test('switches projects and navigates back to the projects list from the switcher', async ({ page }) => {
				const currentProject = projectFactory.build({ name: 'Current Project' });
				const otherProject = projectFactory.build({ name: 'Next Project' });
				const currentProjectMember = projectMemberFactory.build({ projectId: currentProject.id, userId: user.id, role: 'ADMIN' });
				const otherProjectMember = projectMemberFactory.build({ projectId: otherProject.id, userId: user.id, role: 'ADMIN' });

				await mockGetProjectsRequest(page, { json: [currentProject, otherProject] });
				await mockGetProjectRequest(page, currentProject.id, { json: currentProject });
				await mockGetProjectRequest(page, otherProject.id, { json: otherProject });
				await mockGetProjectMemberRequest(page, currentProject.id, { json: currentProjectMember });
				await mockGetProjectMemberRequest(page, otherProject.id, { json: otherProjectMember });
				await mockGetProjectSuggestionsRequest(page, currentProject.id, { json: [] });
				await mockGetProjectSuggestionsRequest(page, otherProject.id, { json: [] });

				await page.goto(`/project/${currentProject.id}/suggestions`);
				await page.getByRole('button', { name: currentProject.name }).click();
				await page.getByRole('menuitemcheckbox', { name: otherProject.name }).click();

				await expect(page).toHaveURL(`/project/${otherProject.id}/suggestions`);

				await page.getByRole('button', { name: otherProject.name }).click();
				await page.getByRole('menuitem', { name: 'Back to projects' }).click();

				await expect(page).toHaveURL('/projects');
				await expect(page.getByRole('heading', { name: currentProject.name })).toBeVisible();
				await expect(page.getByRole('heading', { name: otherProject.name })).toBeVisible();
			});
		});
	});
});
