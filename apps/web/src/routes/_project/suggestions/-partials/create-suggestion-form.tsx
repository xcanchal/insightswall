import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export interface CreateSuggestionFormProps {
	onCancel: () => void;
	onSubmit: (/* suggestion: CreateSuggestionRequest */) => void;
}

export const CreateSuggestionForm = ({ onCancel, onSubmit }: CreateSuggestionFormProps) => {
	return (
		<div className="flex flex-col gap-4 border rounded-lg p-4">
			<Input type="text" placeholder="Title" />
			<Textarea placeholder="Description" />
			<div className="flex gap-2 justify-end">
				<Button size="lg" onClick={onCancel}>
					Cancel
				</Button>
				<Button variant="default" size="lg" onClick={onSubmit}>
					Create
				</Button>
			</div>
		</div>
	);
};
