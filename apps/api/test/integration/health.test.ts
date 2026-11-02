import { describe, expect, it, vi } from 'vitest';

vi.mock('../../src/lib/auth.js', () => ({
	auth: {
		api: { getSession: vi.fn() },
		handler: vi.fn().mockResolvedValue(new Response('', { status: 200 })),
	},
}));

import { Server } from '../../src/server.js';
import { createTestDb, createTestServer } from '../helpers.js';

describe('GET /health', () => {
	it('returns ok when the database responds', async () => {
		const server = createTestServer(await createTestDb());

		const res = await server.request('/health');

		expect(res.status).toBe(200);
		expect(await res.json()).toEqual({ status: 'ok' });
	});

	it('returns 503 when the database fails', async () => {
		const server = new Server({
			port: 0,
			frontendUrl: 'http://localhost:5173',
			db: { execute: vi.fn().mockRejectedValue(new Error('connection refused')) },
		});

		const res = await server.request('/health');

		expect(res.status).toBe(503);
		expect(await res.json()).toEqual({ status: 'unavailable' });
	});
});
