export const HeaderContainer = ({ children }: { children: React.ReactNode }) => {
	return (
		<header className="sticky top-0 border-b z-10 bg-background">
			<div className="container mx-auto flex items-center justify-between px-4 md:px-0 py-4 ">{children}</div>
		</header>
	);
};
