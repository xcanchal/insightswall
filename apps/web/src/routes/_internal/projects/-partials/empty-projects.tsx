import { Button } from '@/components/ui/button';
import { HugeiconsIcon } from '@hugeicons/react';
import { PlusSignIcon } from '@hugeicons/core-free-icons';

export const EmptyProjects = () => {
	return (
		<div className="w-full flex flex-col items-center justify-center">
			<div className="w-full flex flex-col items-center justify-center p-12 rounded-lg gap-4">
				<div className="flex flex-col items-center justify-center gap-2 text-center">
					<h3>No projects found</h3>
					<p className="text-muted-foreground">Create a new project to get started</p>
				</div>
				<Button onClick={() => {}}>
					<HugeiconsIcon icon={PlusSignIcon} /> Create project
				</Button>
			</div>
		</div>
	);
};
