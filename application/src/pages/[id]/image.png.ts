import type { APIRoute, InferGetStaticPropsType } from "astro";

import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

import { image } from "@ceopaludetto/image";
import { ImageResponse } from "@vercel/og";
import { getCollection } from "astro:content";

import { createThemeFromBaseColor } from "~/utilities/theme";

type APIRouteProps = InferGetStaticPropsType<typeof getStaticPaths>;

export const GET: APIRoute<APIRouteProps> = async ({ props: { entry } }) => {
	const lora = await readFont("@fontsource/lora/files/lora-latin-400-normal.woff");
	const poppins = await readFont("@fontsource/poppins/files/poppins-latin-400-normal.woff");

	const theme = createThemeFromBaseColor(entry.data.color);
	const html = image({ title: entry.data.title, date: entry.data.date, theme: theme.dark });

	return new ImageResponse(html, { width: 1200, height: 630, fonts: [
		{ name: "Lora", data: lora, style: "normal" },
		{ name: "Poppins", data: poppins, style: "normal" },
	]	});
};

export async function getStaticPaths() {
	return (await getCollection("posts", ({ data }) => import.meta.env.DEV || !data.draft))
		.map((entry) => ({ params: { id: entry.id }, props: { entry } }));
}

async function readFont(name: string) {
	const mod = await import.meta.resolve!(name);
	return readFile(fileURLToPath(mod));
}
