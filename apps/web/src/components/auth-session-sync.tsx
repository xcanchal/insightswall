import { useEffect } from 'react';
import { useRouter } from '@tanstack/react-router';
import { useSession } from '@/lib/auth-client';

export function AuthSessionSync() {
	const router = useRouter();
	const { data: session, isPending } = useSession();

	useEffect(() => {
		router.update({
			context: {
				...router.options.context,
				session: session ?? null,
				isPending,
			},
		});
		void router.invalidate();
	}, [isPending, router, session]);

	return null;
}
