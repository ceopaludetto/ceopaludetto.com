import type { Element, ElementContent } from "hast";
import type { ShikiTransformerContextCommon } from "shiki";

import { fromMarkdown } from "mdast-util-from-markdown";
import { gfmFromMarkdown } from "mdast-util-gfm";
import { defaultHandlers, toHast } from "mdast-util-to-hast";

export function renderMarkdown(this: ShikiTransformerContextCommon, md: string): ElementContent[] {
	const mdast = fromMarkdown(
		md.replace(/\{@link ([^}]*)\}/g, "$1"), // replace jsdoc links
		{ mdastExtensions: [gfmFromMarkdown()] },
	);

	return (toHast(mdast, {
		handlers: {
			code: (state, node) => {
				const lang = node.lang || "";
				if (lang) {
					return <Element>{
						type: "element",
						tagName: "code",
						properties: {},
						children: this.codeToHast(
							node.value,
							{
								...this.options,
								transformers: [],
								lang,
								structure: node.value.trim().includes("\n") ? "classic" : "inline",
							},
						).children,
					};
				}
				return defaultHandlers.code(state, node);
			},
		},
	}) as Element).children;
}

export function renderMarkdownInline(
	this: ShikiTransformerContextCommon,
	markdown: string,
	context?: string,
): ElementContent[] {
	if (context === "tag:param")
		markdown = markdown.replace(/^([\w$-]+)/, "`$1` ");

	const children = renderMarkdown.call(this, markdown);

	if (children.length === 1 && children[0]!.type === "element" && children[0]!.tagName === "p")
		return children[0]!.children;

	return children;
}
