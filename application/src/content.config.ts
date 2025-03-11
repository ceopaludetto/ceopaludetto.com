import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";
import { parse } from "date-fns";

const postCollection = defineCollection({
	loader: glob({ pattern: "*/index.mdx", base: "../posts" }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		date: z.string().transform<Date>((value) => parse(value, "yyyy-MM-dd", new Date())),
		color: z.string(),
		draft: z.boolean().default(true),
	}),
});

export const collections = { posts: postCollection };
