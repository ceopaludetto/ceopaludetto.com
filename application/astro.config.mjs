/* eslint-disable style/max-len */
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import { renderMarkdown, renderMarkdownInline } from "@ceopaludetto/twoslash";
import { transformerTwoslash } from "@shikijs/twoslash";
import { defineConfig } from "astro/config";
import { FontaineTransform } from "fontaine";

const fonts = [
	{ name: "lora", fallbacks: ["ui-sans-serif", "Helvetica Neue", "Arial", "sans-serif"] },
	{ name: "poppins", fallbacks: ["ui-sans-serif", "Helvetica Neue", "Arial", "sans-serif"] },
	{ name: "monaspace-neon", fallbacks: ["SFMono-Regular", "Menlo", "Monaco", "Consolas", "Liberation Mono", "Courier New", "monospace"] },
];

// https://astro.build/config
export default defineConfig({
	site: "https://ceopaludetto.com",
	prefetch: { prefetchAll: true },
	integrations: [
		mdx({
			shikiConfig: {
				theme: "css-variables",
				transformers: [
					transformerTwoslash({
						rendererRich: { errorRendering: "hover", renderMarkdown, renderMarkdownInline, classExtra: "not-prose" },
					}),
				],
			},
		}),
		tailwind(),
		sitemap(),
	],
	vite: {
		plugins: fonts.map(({ fallbacks, name }) =>
			FontaineTransform.vite({
				fallbacks,
				resolvePath: (id) => `./node_modules/@fontsource/${name}/files/${id}.woff2`,
			}),
		),
	},
});
