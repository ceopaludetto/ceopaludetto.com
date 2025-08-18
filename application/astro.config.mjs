/* eslint-disable style/max-len */
import { resolve } from "node:path";

import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import { renderMarkdown, renderMarkdownInline } from "@ceopaludetto/twoslash";
import { transformerTwoslash } from "@shikijs/twoslash";
import { defineConfig } from "astro/config";
import { FontaineTransform } from "fontaine";
import { toString } from "mdast-util-to-string";
import getReadingTime from "reading-time";
import icons from "unplugin-icons/vite";

const fonts = [
	{ name: "lora", fallbacks: ["ui-sans-serif", "Helvetica Neue", "Arial", "sans-serif"] },
	{ name: "poppins", fallbacks: ["ui-sans-serif", "Helvetica Neue", "Arial", "sans-serif"] },
	{ name: "monaspace-neon", fallbacks: ["SFMono-Regular", "Menlo", "Monaco", "Consolas", "Liberation Mono", "Courier New", "monospace"] },
];

function remarkReadingTime() {
	return function (tree, { data }) {
		const textOnPage = toString(tree);
		const readingTime = getReadingTime(textOnPage);

		data.astro.frontmatter.minutesRead = readingTime.text;
	};
}

// https://astro.build/config
export default defineConfig({
	site: "https://ceopaludetto.com",
	prefetch: { prefetchAll: true },
	markdown: { remarkPlugins: [remarkReadingTime] },
	image: { domains: ["raw.githubusercontent.com", "unsplash.com"] },
	integrations: [
		mdx({
			shikiConfig: {
				theme: "css-variables",
				transformers: [
					transformerTwoslash({
						explicitTrigger: true,
						rendererRich: { errorRendering: "hover", renderMarkdown, renderMarkdownInline, classExtra: "not-prose" },
					}),
				],
			},
		}),
		tailwind(),
		sitemap(),
	],
	vite: {
		plugins: [
			...fonts.map(({ fallbacks, name }) =>
				FontaineTransform.vite({
					fallbacks,
					resolvePath: (id) => resolve(`../node_modules/@fontsource/${name}/files/${id}.woff2`),
				}),
			),
			icons({ compiler: "astro" }),
		],
	},
});
