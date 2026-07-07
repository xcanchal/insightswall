import { Link } from '@tanstack/react-router';

export interface ProjectSectionToggleProps {
	projectId: string;
	showRoadmap: boolean;
}

const tabClass = 'px-4 py-2 text-sm rounded-md transition-colors flex-1 text-center';
const activeTabClass = 'bg-background shadow-sm font-medium';

export const ProjectSectionToggle = ({ projectId, showRoadmap }: ProjectSectionToggleProps) => {
	return (
		<div className="flex items-center gap-1 w-full sm:w-auto bg-muted p-1 rounded-lg">
			<Link
				to="/project/$projectId/suggestions"
				params={{ projectId: projectId! }}
				className={tabClass}
				activeProps={{ className: activeTabClass }}
			>
				Suggestions
			</Link>
			{showRoadmap && (
				<Link
					to="/project/$projectId/roadmap"
					params={{ projectId: projectId! }}
					className={tabClass}
					activeProps={{ className: activeTabClass }}
				>
					Roadmap
				</Link>
			)}
		</div>
	);
};
