import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";
import { parse } from "date-fns";

const postCollection = defineCollection({
	loader: glob({ pattern: "*/index.mdx", base: "../posts" }),
	schema: ({ image }) => z.object({
		title: z.string(),
		description: z.string(),
		date: z.string().transform<Date>((value) => parse(value, "yyyy-MM-dd", new Date())),
		color: z.string(),
		cover: image().optional(),
		coverAlt: z.string().optional(),
		draft: z.boolean().default(true),
		showDependencyMap: z.boolean().default(true),
	})
		.refine((value) => {
			if (value.cover && !value.coverAlt)
				return false;

			return true;
		}, { message: "If you provide a cover, you must also provide a coverAlt." }),
});

export const collections = { posts: postCollection };
