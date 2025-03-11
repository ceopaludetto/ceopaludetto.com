import type { APIRoute } from "astro";

import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { formatRFC7231 } from "date-fns";

import { sortByDate } from "~/utilities/date";

export const GET: APIRoute = async ({ site }) => {
	const posts = (await getCollection("posts", ({ data }) => import.meta.env.DEV || !data.draft))
		.sort(sortByDate);

	return rss({
		title: "ceo — A blog by Carlos Paludetto",
		description: "A personal blog by Carlos Paludetto",
		site: site!,
		customData: `
		<lastBuildDate>${formatRFC7231(new Date())}</lastBuildDate>
		<image>
			<url>${site}/favicon.png</url>
			<title>ceo — A blog by Carlos Paludetto</title>
			<link>${site}</link>
		</image>`,
		items: posts.map((post) => ({
			title: post.data.title,
			link: `/${post.id}`,
			description: post.data.description,
			pubDate: post.data.date,
		})),
	});
};
