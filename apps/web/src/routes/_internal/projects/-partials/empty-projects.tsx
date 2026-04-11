export const EmptyProjects = () => {
	return (
		<div className="w-full flex flex-col items-center justify-center rounded-lg gap-4">
			<div className="flex flex-col items-center justify-center gap-2 text-center">
				<h2>No projects found</h2>
				<p className="text-muted-foreground">Create a new project to get started</p>
			</div>
		</div>
	);
};
