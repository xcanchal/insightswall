export class ApiClientError extends Error {
	statusCode: number;

	constructor(message: string, statusCode: number) {
		super(message);
		this.name = 'ApiClientError';
		this.statusCode = statusCode;
	}
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
	// API and app share the same origin, so relative paths work everywhere.
	const res = await fetch(path, {
		headers: { 'Content-Type': 'application/json', ...init?.headers },
		credentials: 'include',
		...init,
	});

	if (!res.ok) {
		const error: { message?: string; statusCode?: number } = await res.json().catch(() => ({
			error: 'UnknownError',
			message: res.statusText,
			statusCode: res.status,
		}));
		throw new ApiClientError(error.message ?? 'Unknown error', error.statusCode ?? res.status);
	}

	if (res.status === 204) return undefined as T;
	return res.json() as Promise<T>;
}

export const apiClient = {
	get: <T>(path: string) => request<T>(path),
	post: <T>(path: string, body: unknown) => request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
	patch: <T>(path: string, body: unknown) => request<T>(path, { method: 'PATCH', body: JSON.stringify(body) }),
	delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
};
