export const Footer = () => {
	return (
		<div className="h-12 border-t flex items-center">
			<div className="flex items-center justify-between text-sm text-muted-foreground container mx-auto">
				<span>
					© {new Date().getFullYear()} <b>Insightswall</b>
				</span>
				<span>Made by @xcanchal</span>
			</div>
		</div>
	);
};
