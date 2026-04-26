import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Link } from '@tanstack/react-router';

interface ProtectedActionDialogProps {
	isOpen: boolean;
	message: string;
	onOpenChange: (open: boolean) => void;
}

export const ProtectedActionDialog = ({ isOpen, message, onOpenChange }: ProtectedActionDialogProps) => {
	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-sm text-center flex flex-col items-center gap-6">
				<div className="flex flex-col gap-4">
					<DialogTitle>Sign in required</DialogTitle>
					<DialogDescription className="text-muted-foreground">{message}</DialogDescription>
				</div>
				<div className="flex gap-2 w-full">
					<Button asChild variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
						<Link to="/auth/login">Log in</Link>
					</Button>
					<Button asChild className="flex-1" onClick={() => onOpenChange(false)}>
						<Link to="/auth/signup">Sign up</Link>
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
};
