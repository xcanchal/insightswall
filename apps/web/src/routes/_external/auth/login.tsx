import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router';
import { signIn } from '@/lib/auth-client';
import { useState } from 'react';
import { LoginForm, LoginFormValues } from './-partials/login-form';

export const Route = createFileRoute('/_external/auth/login')({
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

	const handleGoToSignup = () => {
		navigate({ to: '/auth/signup' });
	};

	const handleSubmit = async (values: LoginFormValues) => {
		setServerError(null);
		await signIn.email(
			{
				email: values.email,
				password: values.password,
			},
			{
				onSuccess: () => {
					navigate({ to: '/projects' });
				},
				onError: (ctx) => {
					if (ctx.error.status === 403) {
						setServerError('Please verify your email address before signing in.');
					} else {
						setServerError(ctx.error.message);
					}
				},
			}
		);
	};

	return (
		<div className="flex flex-col items-center justify-center py-12">
			<LoginForm serverError={serverError} onGoToSignup={handleGoToSignup} onSubmit={handleSubmit} />
		</div>
	);
}
