import { Factory } from 'rosie';
import { faker } from '@faker-js/faker';
import { Session, User } from 'better-auth';
import { type ProjectResponse } from '../../../src/api/projects';
import { ProjectMemberResponse } from '../../../src/api/project-members';

export const userFactory = Factory.define<User>('user').attrs({
	id: () => faker.string.uuid(),
	name: () => faker.person.firstName(),
	email: () => faker.internet.email(),
	emailVerified: true,
	createdAt: () => faker.date.past(),
	updatedAt: () => faker.date.past(),
});

export const sessionFactory = Factory.define<Session>('session').attrs({
	id: () => faker.string.uuid(),
	userId: () => faker.string.uuid(),
	expiresAt: new Date('2027-01-01T00:00:00.000Z'),
	createdAt: () => faker.date.past(),
	updatedAt: () => faker.date.past(),
	token: () => faker.string.alphanumeric(32),
});

export const projectFactory = Factory.define<ProjectResponse>('project').attrs({
	id: () => faker.string.uuid(),
	name: () => faker.company.name(),
	url: () => faker.internet.url(),
	createdAt: () => faker.date.past().toISOString(),
	updatedAt: null,
});

export const projectMemberFactory = Factory.define<ProjectMemberResponse>('projectMember').attrs({
	projectId: () => faker.string.uuid(),
	userId: () => faker.string.uuid(),
	role: 'ADMIN',
	createdAt: () => faker.date.past().toISOString(),
	updatedAt: null,
});
