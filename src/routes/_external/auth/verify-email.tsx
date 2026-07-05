import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createFileRoute } from '@tanstack/react-router';
import { HugeiconsIcon } from '@hugeicons/react';
import { MailIcon } from '@hugeicons/core-free-icons';

export const Route = createFileRoute('/_external/auth/verify-email')({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="flex flex-col items-center justify-center py-12">
			<div className="flex flex-col gap-4 w-full max-w-md">
				<Card className="w-full text-center">
					<CardHeader className="flex flex-col items-center justify-center gap-4">
						<HugeiconsIcon icon={MailIcon} size={48} className="text-primary mx-auto" />
						<CardTitle className="text-2xl font-bold">Verify your email address</CardTitle>
					</CardHeader>
					<CardContent className="flex flex-col gap-2">
						<p>Please check your email and click the link to verify your email address.</p>
						<p>You will be redirected to your dashboard after verification.</p>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
