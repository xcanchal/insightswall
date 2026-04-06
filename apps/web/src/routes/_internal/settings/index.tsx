import { createFileRoute } from '@tanstack/react-router';
import { signOut, useSession } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';

export const Route = createFileRoute('/_internal/settings/')({
	component: UserSettings,
});

function UserSettings() {
	const { data: session } = useSession();
	return (
		<div className="container max-w-2xl mx-auto">
			<h1>Settings</h1>
			<div className="p-8 border rounded-lg gap-4 flex flex-col">
				<h2>Account details</h2>
				<div className="flex flex-col gap-2">
					<span className="flex flex-col gap-1">
						<b>Name</b> <span>{session?.user?.name}</span>
					</span>
					<span className="flex flex-col gap-1">
						<b>Email</b> <span>{session?.user?.email}</span>
					</span>
				</div>
			</div>
			<Button onClick={() => signOut()}>Log out</Button>
		</div>
	);
}
