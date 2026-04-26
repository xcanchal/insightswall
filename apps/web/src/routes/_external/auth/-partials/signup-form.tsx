import * as z from 'zod';
import { useForm } from '@tanstack/react-form';
import { AlertCircleIcon, Loading03Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

export const SignupFormSchema = z
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

export type SignupFormValues = z.infer<typeof SignupFormSchema>;

interface SignupFormProps {
	serverError: string | null;
	onSubmit: (values: SignupFormValues) => Promise<void> | void;
	onGoToLogin: () => void;
}

export const SignupForm = ({ serverError, onSubmit, onGoToLogin }: SignupFormProps) => {
	const form = useForm({
		defaultValues: {
			name: '',
			email: '',
			password: '',
			confirmPassword: '',
		},
		validators: {
			onChange: SignupFormSchema,
			onSubmit: SignupFormSchema,
		},
		onSubmit: async ({ value }) => {
			await onSubmit(value);
		},
	});

	return (
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
												autoComplete="name"
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
												autoComplete="new-password"
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
												autoComplete="new-password"
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
					<p className="text-sm text-center text-muted-foreground">
						<span>Already have an account?</span>
						<Button
							variant="link"
							onClick={onGoToLogin}
							className="no-underline text-neutral-900 hover:text-primary hover:no-underline px-1"
						>
							Log in
						</Button>
					</p>
				</CardFooter>
			</Card>
		</div>
	);
};
