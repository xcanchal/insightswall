export const EmptySuggestions = () => {
	return (
		<div className="w-full flex flex-col items-center justify-center rounded-lg gap-4 py-10">
			<div className="flex flex-col items-center justify-center gap-2 text-center">
				<h3>No suggestions found</h3>
				<p className="text-muted-foreground">Be the first to submit a suggestion</p>
			</div>
		</div>
	);
};
