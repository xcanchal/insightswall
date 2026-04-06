import { createFileRoute } from '@tanstack/react-router';
import { signOut, useSession } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';

export const Route = createFileRoute('/_internal/account')({
	component: UserSettings,
});

function UserSettings() {
	const { data: session } = useSession();
	return (
		<div className="container max-w-2xl mx-auto sm:py-12">
			<div className="p-8 sm:border rounded-lg gap-10 flex flex-col">
				<div className="flex flex-col gap-4">
					<h3>Account details</h3>
					<div className="flex flex-col gap-2">
						<span className="flex flex-col gap-1">
							<b>Name</b> <span>{session?.user?.name}</span>
						</span>
						<span className="flex flex-col gap-1">
							<b>Email</b> <span>{session?.user?.email}</span>
						</span>
						<Button onClick={() => signOut()} variant="outline" className="sm:w-fit mt-2">
							Log out
						</Button>
					</div>
				</div>
				<div className="flex flex-col gap-4 bg-destructive/10 p-4 rounded-lg">
					<h3 className="text-destructive">Danger zone</h3>
					<div className="flex flex-col gap-2">
						<p>
							<b>Delete your account</b>
						</p>
						<p>This action is irreversible and will permanently delete your account and all your data.</p>
						<Button onClick={() => signOut()} className="sm:w-fit mt-2">
							Delete account
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
