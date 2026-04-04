import { createFileRoute } from '@tanstack/react-router';
import { CreateSuggestionForm } from './-partials/create-suggestion-form';
import { SuggestionsList } from './-partials/suggestions-list';
import { EmptySuggestions } from './-partials/empty-suggestions';
import { useState } from 'react';

export const Route = createFileRoute('/_project/suggestions/')({
	component: RouteComponent,
});

const suggestionsLength = 0;

function RouteComponent() {
	const [formIsOpen, setFormIsOpen] = useState(false);

	return (
		<div className="max-w-4xl mx-auto">
			{suggestionsLength > 0 ? <SuggestionsList /> : <EmptySuggestions />}
			{formIsOpen && (
				<CreateSuggestionForm
					onCancel={() => setFormIsOpen(false)}
					onSubmit={() => {
						/* TODO: Implement submit */
					}}
				/>
			)}
		</div>
	);
}
