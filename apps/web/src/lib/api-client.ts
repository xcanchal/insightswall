if (!import.meta.env.VITE_API_URL) {
	throw new Error('No valid API URL environment variable found');
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
	const res = await fetch(`${import.meta.env.VITE_API_URL}${path}`, {
		headers: { 'Content-Type': 'application/json', ...init?.headers },
		credentials: 'include',
		...init,
	});

	if (!res.ok) {
		const error: Error = await res.json().catch(() => ({
			error: 'UnknownError',
			message: res.statusText,
			statusCode: res.status,
		}));
		throw new Error(error.message ?? 'Unknown error');
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
