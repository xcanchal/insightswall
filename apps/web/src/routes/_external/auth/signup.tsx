import { createFileRoute, Link, redirect } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import * as z from 'zod';
import { useForm } from '@tanstack/react-form';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { signUp } from '@/lib/auth-client';
import { AlertCircleIcon, Loading03Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Alert } from '@/components/ui/alert';
import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';

const SignUpFormSchema = z
	.object({
		name: z.string().min(2, 'Name is required'),
		email: z.string().min(1, 'Email is required').email('Invalid email address'),
		password: z.string().min(8, 'Password must be at least 8 characters'),
		confirmPassword: z.string().min(1, 'Please confirm your password'),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'Passwords do not match',
		path: ['confirmPassword'],
	});

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

	const form = useForm({
		defaultValues: {
			name: '',
			email: '',
			password: '',
			confirmPassword: '',
		},
		validators: {
			onChange: SignUpFormSchema,
			onSubmit: SignUpFormSchema,
		},
		onSubmit: async ({ value }) => {
			setServerError(null);
			await signUp.email(
				{
					name: value.name,
					email: value.email,
					password: value.password,
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
						<CardTitle className="text-2xl font-bold">Create an account</CardTitle>
					</CardHeader>
					<CardContent>
						<form
							id="signup-form"
							onSubmit={(e) => {
								e.preventDefault();
								form.handleSubmit();
							}}
						>
							<FieldGroup className="gap-4">
								<form.Field
									name="name"
									children={(field) => {
										const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
										return (
											<Field data-invalid={isInvalid}>
												<FieldLabel htmlFor={field.name}>Name</FieldLabel>
												<Input
													id={field.name}
													name={field.name}
													value={field.state.value}
													onBlur={field.handleBlur}
													onChange={(e) => field.handleChange(e.target.value)}
													aria-invalid={isInvalid}
													placeholder="Display name"
													autoComplete="off"
												/>
												{isInvalid && <FieldError errors={field.state.meta.errors} />}
											</Field>
										);
									}}
								/>
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
													autoComplete="off"
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
													autoComplete="off"
												/>
												{isInvalid && <FieldError errors={field.state.meta.errors} />}
											</Field>
										);
									}}
								/>
								<form.Field
									name="confirmPassword"
									children={(field) => {
										const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
										return (
											<Field data-invalid={isInvalid}>
												<FieldLabel htmlFor={field.name}>Confirm Password</FieldLabel>
												<Input
													id={field.name}
													name={field.name}
													type="password"
													value={field.state.value}
													onBlur={field.handleBlur}
													onChange={(e) => field.handleChange(e.target.value)}
													aria-invalid={isInvalid}
													placeholder="Confirm Password"
													autoComplete="off"
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
						<Button type="submit" form="signup-form" className="w-full" size="lg" disabled={form.state.isSubmitting}>
							{form.state.isSubmitting ? <HugeiconsIcon icon={Loading03Icon} className="size-5 animate-spin" /> : 'Create account'}
						</Button>
						<p className="text-sm text-muted-foreground text-center">
							Already have an account?{' '}
							<Link to="/auth/login" className="font-semibold">
								Log in
							</Link>
						</p>
					</CardFooter>
				</Card>
			</div>
		</div>
	);
}
