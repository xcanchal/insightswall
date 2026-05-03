import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { toast } from 'sonner';
import { useSession, signOut, deleteUser } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Warning } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

export const Route = createFileRoute('/_internal/account')({
	component: UserSettings,
});

function UserSettings() {
	const { data: session } = useSession();
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);

	const handleDeleteAccount = async () => {
		try {
			setIsDeleting(true);
			await deleteUser();
			setDeleteDialogOpen(false);
		} catch (error) {
			console.error(error);
			toast.error('Failed to delete account.');
		} finally {
			setIsDeleting(false);
		}
	};

	return (
		<div className="container sm:max-w-2xl mx-auto px-4 sm:px-0 py-8">
			<div className="sm:border sm:p-8 rounded-lg gap-10 flex flex-col">
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
						<Button onClick={() => setDeleteDialogOpen(true)} className="sm:w-fit mt-2">
							Delete account
						</Button>
					</div>
				</div>
			</div>

			<Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
				<DialogContent className="max-w-sm flex flex-col gap-4">
					<h2>Delete account</h2>
					<p className="text-muted-foreground">Your account and all related data will be permanently deleted.</p>
					<p className="bg-red-100 py-2 px-3 flex gap-3 rounded-md">
						<HugeiconsIcon icon={Warning} className="size-6 text-destructive" /> This action cannot be undone.
					</p>
					<div className="flex justify-end gap-2">
						<Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
							Cancel
						</Button>
						<Button variant="destructive" onClick={handleDeleteAccount} disabled={isDeleting}>
							Yes, delete
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
}
