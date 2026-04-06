import * as z from 'zod';
import { useForm } from '@tanstack/react-form';
import { Field, FieldError, FieldGroup, FieldLabel, FieldDescription } from '@/components/ui/field';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loading03Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

const CreateProjectSchema = z.object({
	name: z.string().min(1, 'Name is required').max(50, 'Name must be at most 50 characters'),
	slug: z
		.string()
		.min(1, 'Slug is required')
		.max(50, 'Slug must be at most 50 characters')
		.regex(/^[a-z0-9-]+$/, 'Only lowercase letters, numbers and hyphens'),
});

function toSlug(value: string) {
	return value
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9\s-]/g, '')
		.replace(/\s+/g, '-');
}

export interface CreateProjectFormProps {
	onSubmit: (values: { name: string; slug: string }) => Promise<void>;
	onCancel?: () => void;
}

export const CreateProjectForm = ({ onSubmit, onCancel }: CreateProjectFormProps) => {
	const form = useForm({
		defaultValues: { name: '', slug: '' },
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
			className="w-full"
			id="create-project-form"
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
								<FieldLabel htmlFor={field.name}>Project name</FieldLabel>
								<Input
									id={field.name}
									name={field.name}
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => {
										field.handleChange(e.target.value);
										form.setFieldValue('slug', toSlug(e.target.value));
									}}
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
					name="slug"
					children={(field) => {
						const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
						return (
							<Field data-invalid={isInvalid}>
								<FieldLabel htmlFor={field.name}>URL slug</FieldLabel>
								<Input
									id={field.name}
									name={field.name}
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									aria-invalid={isInvalid}
									placeholder="my-product"
									autoComplete="off"
								/>
								<FieldDescription>insightswall.com/p/{field.state.value || 'my-product'}</FieldDescription>
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
