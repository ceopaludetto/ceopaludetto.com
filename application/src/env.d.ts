/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
/// <reference types="unplugin-icons/types/astro" />

declare namespace App {
	type Locals = {
		$id: (prefix: string) => string;
	};
}
