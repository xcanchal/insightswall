import { createFileRoute, Link, redirect, useNavigate } from '@tanstack/react-router';
import { signUp } from '@/lib/auth-client';
import { useState } from 'react';
import { SignupForm } from './-partials/signup-form';

export const Route = createFileRoute('/_external/auth/signup')({
	beforeLoad: ({ context }) => {
		if (!context.isPending && context.session) {
			throw redirect({ to: '/projects' });
		}
	},
	component: RouteComponent,
});

function RouteComponent() {
	const [serverError, setServerError] = useState<string | null>(null);
	const navigate = useNavigate();

	return (
		<div className="flex flex-col items-center justify-center py-12">
			<SignupForm
				serverError={serverError}
				onSubmit={async (values) => {
					setServerError(null);
					await signUp.email(
						{
							name: values.name,
							email: values.email,
							password: values.password,
							callbackURL: `${window.location.origin}/projects`,
						},
						{
							onSuccess: () => {
								navigate({ to: '/auth/verify-email' });
							},
							onError: (ctx) => {
								setServerError(ctx.error.message);
							},
						}
					);
				}}
				footer={
					<p className="text-sm text-muted-foreground text-center">
						Already have an account?{' '}
						<Link to="/auth/login" className="font-semibold">
							Log in
						</Link>
					</p>
				}
			/>
		</div>
	);
}
