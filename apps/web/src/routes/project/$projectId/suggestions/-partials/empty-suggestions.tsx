export const EmptySuggestions = () => {
	return (
		<div className="w-full flex flex-col items-center justify-center rounded-lg gap-4">
			<div className="flex flex-col items-center justify-center gap-2 text-center">
				<h2>No suggestions created</h2>
				<p className="text-muted-foreground">Be the first one to submit a suggestion</p>
			</div>
		</div>
	);
};
