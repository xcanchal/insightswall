import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { CreateProjectForm } from './create-project-form';
import { CreateProjectFormProps } from './create-project-form';
import { PlusSignIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useState } from 'react';

export const CreateProjectDialog = ({ onSubmit, onCancel }: CreateProjectFormProps) => {
	const [open, setOpen] = useState(false);
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger>
				<Button variant="default" size="lg" onClick={() => setOpen(true)}>
					<HugeiconsIcon icon={PlusSignIcon} /> Create project
				</Button>
			</DialogTrigger>
			<DialogContent>
				<CreateProjectForm onSubmit={onSubmit} onCancel={onCancel} />
			</DialogContent>
		</Dialog>
	);
};
