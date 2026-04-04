import { createFileRoute } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const Route = createFileRoute('/auth/signup')({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="flex flex-col items-center justify-center h-screen">
			<h1 className="text-2xl font-bold">Signup</h1>
			<Card>
				<CardHeader>
					<CardTitle>Signup</CardTitle>
				</CardHeader>
				<CardContent></CardContent>
			</Card>
		</div>
	);
}
