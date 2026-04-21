import * as z from 'zod';
import { useForm } from '@tanstack/react-form';
import { SUGGESTION_CATEGORIES } from '@app/types';
import type { SuggestionCategory } from '@app/types';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { HugeiconsIcon } from '@hugeicons/react';
import { BugIcon, Loading03Icon, SparklesIcon } from '@hugeicons/core-free-icons';

const CreateSuggestionSchema = z.object({
	description: z.string().min(1, 'Description is required').max(500, 'Max 500 characters'),
	category: z.enum(SUGGESTION_CATEGORIES),
});

export interface CreateSuggestionFormProps {
	onSubmit: (values: { description: string; category: SuggestionCategory }) => Promise<void>;
	onCancel?: () => void;
}

export const CreateSuggestionForm = ({ onSubmit, onCancel }: CreateSuggestionFormProps) => {
	const form = useForm({
		defaultValues: { description: '', category: 'FEATURE' as SuggestionCategory },
		validators: { onChange: CreateSuggestionSchema, onSubmit: CreateSuggestionSchema },
		onSubmit: async ({ value }) => {
			await onSubmit(value);
		},
	});

	return (
		<form
			className="w-full flex flex-col gap-6"
			onSubmit={(e) => {
				e.preventDefault();
				form.handleSubmit();
			}}
		>
			<h2>Submit a suggestion</h2>
			<FieldGroup className="gap-4">
				<form.Field
					name="category"
					children={(field) => (
						<Field>
							<FieldLabel>Category</FieldLabel>
							<Select value={field.state.value} onValueChange={(v) => field.handleChange(v as SuggestionCategory)}>
								<SelectTrigger className="w-full">
									<SelectValue placeholder="Select a category" />
								</SelectTrigger>
								<SelectContent>
									<SelectGroup>
										<SelectLabel>Category</SelectLabel>
										{SUGGESTION_CATEGORIES.map((category) => (
											<SelectItem key={category} value={category}>
												<HugeiconsIcon icon={category === 'FEATURE' ? SparklesIcon : BugIcon} />
												{category}
											</SelectItem>
										))}
									</SelectGroup>
								</SelectContent>
							</Select>
						</Field>
					)}
				/>
				<form.Field
					name="description"
					children={(field) => {
						const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
						return (
							<Field data-invalid={isInvalid}>
								<FieldLabel htmlFor={field.name}>Description</FieldLabel>
								<Textarea
									id={field.name}
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									aria-invalid={isInvalid}
									placeholder="Describe your feature request or bug report..."
									rows={4}
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
						{form.state.isSubmitting ? <HugeiconsIcon icon={Loading03Icon} className="size-4 animate-spin" /> : 'Submit'}
					</Button>
				</div>
			</FieldGroup>
		</form>
	);
};
