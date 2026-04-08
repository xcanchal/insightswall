export const HeaderContainer = ({ children }: { children: React.ReactNode }) => {
	return (
		<header className="sticky top-0 bg-white border-b z-10">
			<div className="container mx-auto flex items-center justify-between px-4 md:px-0 py-4 ">{children}</div>
		</header>
	);
};
