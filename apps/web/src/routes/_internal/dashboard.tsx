import { createFileRoute } from '@tanstack/react-router';
import { useSession } from '@/lib/auth-client';

export const Route = createFileRoute('/_internal/dashboard')({
	component: RouteComponent,
});

function RouteComponent() {
	const { data: session } = useSession();
	console.log(session);
	return <div>Hello {session?.user?.name}!</div>;
}
