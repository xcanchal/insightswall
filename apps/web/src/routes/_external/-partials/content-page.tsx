import type { ReactNode } from 'react';

type ArticleBlock =
	| {
			type: 'paragraph';
			text: ReactNode;
	  }
	| {
			type: 'list';
			items: ReactNode[];
	  };

interface ArticleSection {
	title: string;
	blocks: ArticleBlock[];
}

interface ContentPageProps {
	eyebrow: string;
	title: string;
	intro: ReactNode[];
	relatedResources?: ResourceCard[];
	sections: ArticleSection[];
}

interface ResourceCard {
	title: string;
	description: string;
	href: string;
}

interface ResourceCardsProps {
	cards: ResourceCard[];
}

interface ContentLinkProps {
	children: ReactNode;
	href: string;
}

export const ContentLink = ({ children, href }: ContentLinkProps) => {
	return (
		<a href={href} className="font-semibold text-zinc-950 hover:text-primary">
			{children}
		</a>
	);
};

export const ContentPage = ({ eyebrow, title, intro, sections, relatedResources }: ContentPageProps) => {
	return (
		<article className="border-t border-zinc-200 bg-white">
			<div className="mx-auto max-w-3xl px-6 py-16 sm:py-24 lg:px-8">
				<header className="space-y-5">
					<p className="text-sm font-semibold uppercase text-primary">{eyebrow}</p>
					<h1 className="text-4xl font-black leading-tight text-zinc-950 sm:text-5xl">{title}</h1>
					<div className="space-y-6 text-lg leading-8 text-zinc-700">
						{intro.map((paragraph, index) => (
							<p key={`${title}-intro-${index}`}>{paragraph}</p>
						))}
					</div>
				</header>

				<div className="mt-12 space-y-12">
					{sections.map((section) => (
						<section key={section.title} className="space-y-5">
							<h2 className="text-2xl font-black leading-tight text-zinc-950 sm:text-3xl">{section.title}</h2>
							<div className="space-y-5 text-lg leading-8 text-zinc-700">
								{section.blocks.map((block, index) =>
									block.type === 'paragraph' ? (
										<p key={`${section.title}-${index}`}>{block.text}</p>
									) : (
										<ul key={`${section.title}-${index}`} className="list-disc space-y-2 pl-6">
											{block.items.map((item, itemIndex) => (
												<li key={`${section.title}-${index}-${itemIndex}`}>{item}</li>
											))}
										</ul>
									)
								)}
							</div>
						</section>
					))}

					{relatedResources?.length ? (
						<section className="border-t border-zinc-200 pt-10">
							<div className="space-y-5">
								<h2 className="text-2xl font-black leading-tight text-zinc-950 sm:text-3xl">Related resources</h2>
								<ResourceCards cards={relatedResources} />
							</div>
						</section>
					) : null}
				</div>
			</div>
		</article>
	);
};

export const ResourceCards = ({ cards }: ResourceCardsProps) => {
	return (
		<div className="grid gap-4 sm:grid-cols-2">
			{cards.map((card) => (
				<a
					key={card.href}
					href={card.href}
					className="group rounded-lg border border-zinc-200 bg-white p-5 transition hover:border-zinc-300 hover:bg-zinc-50"
				>
					<h3 className="text-xl font-bold leading-tight text-zinc-950 group-hover:text-primary">{card.title}</h3>
					<p className="mt-3 text-sm leading-6 text-zinc-600">{card.description}</p>
				</a>
			))}
		</div>
	);
};
