export function formatDate(date: Date) {
	const showYear = date.getFullYear() !== new Date().getFullYear();
	return new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', ...(showYear && { year: 'numeric' }) }).format(date);
}
