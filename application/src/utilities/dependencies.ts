import type { CollectionEntry } from "astro:content";

import { readFile } from "node:fs/promises";

type MaybePackageJson = {
	dependencies?: Record<string, string>;
};

/**
 * Collect dependencies from a post entry package.json
 *
 * @param entry post entry
 * @returns dependencies
 */
export async function collectDependenciesFromPost(entry: CollectionEntry<"posts">) {
	if (!entry.filePath) throw new Error("No file path found for entry");

	const packageJsonPath = entry.filePath.replace("index.mdx", "package.json");
	const fileContents = await readFile(packageJsonPath, "utf-8");

	const { dependencies = {} } = JSON.parse(fileContents) as MaybePackageJson;
	return Object.entries(dependencies);
}
