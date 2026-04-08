import { Button } from '@/components/ui/button';
import { HugeiconsIcon } from '@hugeicons/react';
import { PlusSignIcon } from '@hugeicons/core-free-icons';

export type CreateProjectButtonProps = {
	onClick: () => void;
};

export const CreateProjectButton = ({ onClick }: CreateProjectButtonProps) => {
	return (
		<Button variant="default" size="lg" onClick={onClick}>
			<HugeiconsIcon icon={PlusSignIcon} /> Create project
		</Button>
	);
};
