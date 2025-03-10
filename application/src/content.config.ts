import { defineCollection, reference, z } from "astro:content";
import { glob } from "astro/loaders";
import { parse } from "date-fns";

const postCollection = defineCollection({
	loader: glob({ pattern: "*.mdx", base: "./src/data/posts" }),
	schema: z.object({
		title: z.string(),
		date: z.string().transform((value) => parse(value, "yyyy-MM-dd", new Date())),
		color: z.string(),
		draft: z.boolean().default(true),
		related: z.array(reference("posts")).default([]),
	}),
});

export const collections = { posts: postCollection };
