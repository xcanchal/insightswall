export interface EmptyRoadmapProps {
	isAdmin: boolean;
}

export const EmptyRoadmap = ({ isAdmin }: EmptyRoadmapProps) => {
	return (
		<div className="w-full flex flex-col items-center justify-center rounded-lg gap-4">
			<div className="flex flex-col items-center justify-center gap-2 text-center">
				<h2>No suggestions in roadmap</h2>
				<p className="text-muted-foreground">No suggestions have need added to the roadmap yet. </p>
				{isAdmin && (
					<p className="text-muted-foreground">
						Change a suggestion status to &apos;Planned&apos;, &apos;In Progress&apos;, or &apos;Done&apos; to add them.
					</p>
				)}
			</div>
		</div>
	);
};
