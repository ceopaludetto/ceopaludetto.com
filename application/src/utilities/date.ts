import type { CollectionEntry } from "astro:content";

import { isBefore } from "date-fns";

export function sortByDate(a: CollectionEntry<"posts">, b: CollectionEntry<"posts">) {
	return isBefore(a.data.date, b.data.date) ? 1 : -1;
}
