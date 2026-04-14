import { createFileRoute, Link, redirect, useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import * as z from 'zod';
import { useForm } from '@tanstack/react-form';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { signIn } from '@/lib/auth-client';
import { AlertCircleIcon, Loading03Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Alert } from '@/components/ui/alert';
import { useState } from 'react';

const LoginFormSchema = z.object({
	email: z.string().min(1, 'Email is required').email('Invalid email address'),
	password: z.string().min(1, 'Password is required'),
});

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

	const form = useForm({
		defaultValues: {
			email: '',
			password: '',
		},
		validators: {
			onChange: LoginFormSchema,
			onSubmit: LoginFormSchema,
		},
		onSubmit: async ({ value }) => {
			setServerError(null);
			await signIn.email(
				{
					email: value.email,
					password: value.password,
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
		},
	});

	return (
		<div className="flex flex-col items-center justify-center py-12">
			<div className="flex flex-col gap-4 w-full max-w-sm">
				{serverError && (
					<Alert variant="destructive">
						<HugeiconsIcon icon={AlertCircleIcon} /> {serverError}
					</Alert>
				)}
				<Card className="w-full">
					<CardHeader>
						<CardTitle className="text-2xl font-bold">Log in to your account</CardTitle>
					</CardHeader>
					<CardContent>
						<form
							id="login-form"
							onSubmit={(e) => {
								e.preventDefault();
								form.handleSubmit();
							}}
						>
							<FieldGroup className="gap-4">
								<form.Field
									name="email"
									children={(field) => {
										const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
										return (
											<Field data-invalid={isInvalid}>
												<FieldLabel htmlFor={field.name}>Email</FieldLabel>
												<Input
													id={field.name}
													name={field.name}
													value={field.state.value}
													onBlur={field.handleBlur}
													onChange={(e) => field.handleChange(e.target.value)}
													aria-invalid={isInvalid}
													placeholder="Email address"
													autoComplete="email"
												/>
												{isInvalid && <FieldError errors={field.state.meta.errors} />}
											</Field>
										);
									}}
								/>
								<form.Field
									name="password"
									children={(field) => {
										const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
										return (
											<Field data-invalid={isInvalid}>
												<FieldLabel htmlFor={field.name}>Password</FieldLabel>
												<Input
													id={field.name}
													name={field.name}
													type="password"
													value={field.state.value}
													onBlur={field.handleBlur}
													onChange={(e) => field.handleChange(e.target.value)}
													aria-invalid={isInvalid}
													placeholder="Password"
													autoComplete="current-password"
												/>
												{isInvalid && <FieldError errors={field.state.meta.errors} />}
											</Field>
										);
									}}
								/>
							</FieldGroup>
						</form>
					</CardContent>
					<CardFooter className="flex flex-col gap-4">
						<Button type="submit" form="login-form" className="w-full" size="lg" disabled={form.state.isSubmitting}>
							{form.state.isSubmitting ? <HugeiconsIcon icon={Loading03Icon} className="size-5 animate-spin" /> : 'Log in'}
						</Button>
						<p className="text-sm text-muted-foreground text-center">
							Don&apos;t have an account?{' '}
							<Link to="/auth/signup" className="font-semibold">
								Sign up
							</Link>
						</p>
					</CardFooter>
				</Card>
			</div>
		</div>
	);
}
