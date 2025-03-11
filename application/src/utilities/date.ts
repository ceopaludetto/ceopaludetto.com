import type { CollectionEntry } from "astro:content";

import { isBefore } from "date-fns";

/**
 * Sort two posts by date
 *
 * @param a post
 * @param b post
 * @returns order
 */
export function sortByDate(a: CollectionEntry<"posts">, b: CollectionEntry<"posts">) {
	return isBefore(a.data.date, b.data.date) ? 1 : -1;
}
