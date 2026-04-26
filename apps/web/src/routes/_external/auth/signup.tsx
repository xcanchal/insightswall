import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router';
import { signUp } from '@/lib/auth-client';
import { useState } from 'react';
import { SignupForm, SignupFormValues } from './-partials/signup-form';

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

	const handleGoToLogin = () => {
		navigate({ to: '/auth/login' });
	};

	const handleSubmit = async (values: SignupFormValues) => {
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
	};

	return (
		<div className="flex flex-col items-center justify-center py-12">
			<SignupForm serverError={serverError} onGoToLogin={handleGoToLogin} onSubmit={handleSubmit} />
		</div>
	);
}
