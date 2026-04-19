import { PlusSignIcon } from '@hugeicons/core-free-icons';
import { Button } from './ui/button';
import { HugeiconsIcon } from '@hugeicons/react';

export type CreateButtonProps = {
	size?: 'default' | 'lg';
	label: string;
	onClick: () => void;
};

export const CreateButton = ({ label, size = 'default', onClick }: CreateButtonProps) => {
	return (
		<Button variant="default" onClick={onClick} className="w-fit" size={size}>
			<HugeiconsIcon icon={PlusSignIcon} /> {label}
		</Button>
	);
};
