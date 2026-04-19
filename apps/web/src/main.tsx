import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from '@tanstack/react-router';

import './index.css';
import { createAppRouter } from './lib/router';
import { useSession } from './lib/auth-client';

const queryClient = new QueryClient();

const router = createAppRouter(queryClient);

function App() {
	const { data: session, isPending } = useSession();

	useEffect(() => {
		router.invalidate();
	}, [session, isPending]);

	return <RouterProvider router={router} context={{ queryClient, session, isPending }} />;
}

declare module '@tanstack/react-router' {
	interface Register {
		router: typeof router;
	}
}

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<QueryClientProvider client={queryClient}>
			<App />
		</QueryClientProvider>
	</StrictMode>
);
