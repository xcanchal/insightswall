import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { HugeiconsIcon } from '@hugeicons/react';
import { Bell, User02Icon } from '@hugeicons/core-free-icons';

export interface AuthButtonsProps {
	signedIn: boolean;
}

export const AuthButtons = ({ signedIn }: AuthButtonsProps) => {
	return signedIn ? (
		<>
			<Button variant="ghost" size="icon">
				<HugeiconsIcon icon={Bell} className="size-6" />
			</Button>
			<Link to="/account">
				<Button variant="ghost" size="icon">
					<HugeiconsIcon icon={User02Icon} className="size-6" />
				</Button>
			</Link>
		</>
	) : (
		<>
			<Link to="/auth/login" className="text-sm font-semibold">
				Log in
			</Link>
			<Link to="/auth/signup">
				<Button>Sign up</Button>
			</Link>
		</>
	);
};
