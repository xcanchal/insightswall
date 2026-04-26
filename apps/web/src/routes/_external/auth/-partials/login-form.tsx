import * as z from 'zod';
import { useForm } from '@tanstack/react-form';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert } from '@/components/ui/alert';
import { AlertCircleIcon, Loading03Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

export const LoginFormSchema = z.object({
	email: z.string().min(1, 'Email is required').email('Invalid email address'),
	password: z.string().min(1, 'Password is required'),
});

export type LoginFormValues = z.infer<typeof LoginFormSchema>;

interface LoginFormProps {
	serverError: string | null;
	onSubmit: (values: LoginFormValues) => Promise<void> | void;
	onGoToSignup: () => void;
}

export const LoginForm = ({ serverError, onSubmit, onGoToSignup }: LoginFormProps) => {
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
				<CardFooter className="flex flex-col gap-2">
					<Button type="submit" form="login-form" className="w-full" size="lg" disabled={form.state.isSubmitting}>
						{form.state.isSubmitting ? <HugeiconsIcon icon={Loading03Icon} className="size-5 animate-spin" /> : 'Log in'}
					</Button>
					<p className="text-sm text-center text-muted-foreground">
						<span>Don&apos;t have an account?</span>
						<Button
							variant="link"
							onClick={onGoToSignup}
							className="no-underline text-neutral-900 hover:text-primary hover:no-underline px-1"
						>
							Sign up
						</Button>
					</p>
				</CardFooter>
			</Card>
		</div>
	);
};
