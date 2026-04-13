import * as z from 'zod';
import { useForm } from '@tanstack/react-form';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loading03Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

const CreateProjectSchema = z.object({
	name: z.string().min(1, 'Name is required').max(50, 'Name must be at most 50 characters'),
	url: z.string().url('Must be a valid URL').nullable(),
});

export interface CreateProjectFormProps {
	onSubmit: (values: { name: string; url?: string | null }) => Promise<void>;
	onCancel?: () => void;
}

export const CreateProjectForm = ({ onSubmit, onCancel }: CreateProjectFormProps) => {
	const form = useForm({
		defaultValues: { name: '', url: null as string | null },
		validators: {
			onChange: CreateProjectSchema,
			onSubmit: CreateProjectSchema,
		},
		onSubmit: async ({ value }) => {
			await onSubmit(value);
		},
	});

	return (
		<form
			className="w-full flex flex-col gap-6"
			id="create-project-form"
			onSubmit={(e) => {
				e.preventDefault();
				form.handleSubmit();
			}}
		>
			<h2>Create a project</h2>
			<FieldGroup className="gap-4">
				<form.Field
					name="name"
					children={(field) => {
						const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
						return (
							<Field data-invalid={isInvalid}>
								<FieldLabel htmlFor={field.name}>Project name</FieldLabel>
								<Input
									id={field.name}
									name={field.name}
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									aria-invalid={isInvalid}
									placeholder="My product"
									autoComplete="off"
								/>
								{isInvalid && <FieldError errors={field.state.meta.errors} />}
							</Field>
						);
					}}
				/>
				<form.Field
					name="url"
					children={(field) => {
						const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
						return (
							<Field data-invalid={isInvalid}>
								<FieldLabel htmlFor={field.name}>
									Website URL <span className="text-muted-foreground text-xs font-normal">(optional)</span>
								</FieldLabel>
								<Input
									id={field.name}
									name={field.name}
									value={field.state.value ?? ''}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value || null)}
									aria-invalid={isInvalid}
									placeholder="https://myproduct.com"
									autoComplete="off"
								/>
								{isInvalid && <FieldError errors={field.state.meta.errors} />}
							</Field>
						);
					}}
				/>
				<div className="flex gap-2 justify-end pt-2">
					{onCancel && (
						<Button type="button" variant="outline" onClick={onCancel}>
							Cancel
						</Button>
					)}
					<Button type="submit" disabled={form.state.isSubmitting}>
						{form.state.isSubmitting ? <HugeiconsIcon icon={Loading03Icon} className="size-4 animate-spin" /> : 'Create project'}
					</Button>
				</div>
			</FieldGroup>
		</form>
	);
};
