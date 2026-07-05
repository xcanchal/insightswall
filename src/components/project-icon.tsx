import { Globe02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

export interface FaviconLoaderProps {
	url: string | null;
	sizeClassName?: string;
}

export const ProjectIcon = ({ url, sizeClassName = 'size-7' }: FaviconLoaderProps) => {
	return url ? (
		<img src={`https://www.google.com/s2/favicons?domain=${url}&sz=32`} className={`${sizeClassName} rounded-xs`} />
	) : (
		<HugeiconsIcon icon={Globe02Icon} className={`${sizeClassName} text-muted-foreground`} />
	);
};
