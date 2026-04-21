import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowDownIcon, BugIcon, SearchIcon, SparklesIcon } from '@hugeicons/core-free-icons';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuTrigger,
	DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import { SUGGESTION_STATUSES, SuggestionCategory, SuggestionStatus } from '@app/types';
import { SUGGESTION_CATEGORIES } from '@app/types';
import { formatSuggestionStatus } from '@/utils';

interface SuggestionsFiltersProps {
	search: string;
	categories: SuggestionCategory[];
	statuses: SuggestionStatus[];
	show?: 'mostVoted' | 'newest';
	onSearchChange: (search: string) => void;
	onCategoryChange: (categories: SuggestionCategory[]) => void;
	onStatusChange: (statuses: SuggestionStatus[]) => void;
	onShowChange: (show: 'mostVoted' | 'newest') => void;
}

export const SuggestionsFilters = ({
	search,
	categories,
	statuses,
	show = 'mostVoted',
	onSearchChange,
	onCategoryChange,
	onStatusChange,
	onShowChange,
}: SuggestionsFiltersProps) => {
	return (
		<div className="flex flex-col sm:flex-row items-center gap-2 w-full">
			{/* Search */}
			<InputGroup className="w-full">
				<InputGroupAddon>
					<HugeiconsIcon icon={SearchIcon} className="size-4" />
				</InputGroupAddon>
				<InputGroupInput value={search} onChange={(e) => onSearchChange(e.target.value)} placeholder="Search..." />
			</InputGroup>
			<div className="flex items-center gap-1 sm:gap-2 w-full md:w-auto">
				{/* Category */}
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="outline" className="flex flex-1 justify-left">
							Category <HugeiconsIcon icon={ArrowDownIcon} className="size-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent className="sm:w-48" align="start">
						<DropdownMenuGroup>
							{SUGGESTION_CATEGORIES.map((category) => (
								<DropdownMenuCheckboxItem
									key={category}
									checked={categories.includes(category)}
									onCheckedChange={(checked) =>
										onCategoryChange(checked ? [...categories, category] : categories.filter((c) => c !== category))
									}
								>
									<HugeiconsIcon icon={category === 'FEATURE' ? SparklesIcon : BugIcon} />
									{category}
								</DropdownMenuCheckboxItem>
							))}
						</DropdownMenuGroup>
					</DropdownMenuContent>
				</DropdownMenu>
				{/* Status */}
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="outline" className="flex flex-1 justify-left">
							Status <HugeiconsIcon icon={ArrowDownIcon} className="size-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent className="sm:w-48" align="start">
						<DropdownMenuGroup>
							{SUGGESTION_STATUSES.map((status) => (
								<DropdownMenuCheckboxItem
									key={status}
									checked={statuses.includes(status)}
									onCheckedChange={(checked) => onStatusChange(checked ? [...statuses, status] : statuses.filter((s) => s !== status))}
								>
									{formatSuggestionStatus(status)}
								</DropdownMenuCheckboxItem>
							))}
						</DropdownMenuGroup>
					</DropdownMenuContent>
				</DropdownMenu>
				{/* Sorting */}
				<ButtonGroup className="w-full sm:w-auto flex flex-1">
					<Button
						variant="outline"
						className={`flex-1 ${show === 'mostVoted' ? 'bg-neutral-100 text-neutral-900' : ''}`}
						onClick={() => onShowChange('mostVoted')}
					>
						Most voted
					</Button>
					<Button
						variant="outline"
						className={`flex-1 ${show === 'newest' ? 'bg-neutral-100 text-neutral-900' : ''}`}
						onClick={() => onShowChange('newest')}
					>
						Newest
					</Button>
				</ButtonGroup>
			</div>
		</div>
	);
};
