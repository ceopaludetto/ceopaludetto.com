import { argbFromHex, rgbaFromArgb } from "@material/material-color-utilities";
import { transform } from "lightningcss";
import { themeFromSourceColor } from "mcu-extra";

type ColorScheme = "dark" | "light";

function toRGBString(value: number) {
	const { r, g, b } = rgbaFromArgb(value);
	return [r, g, b].join(" ");
}

export function createThemeFromBaseColor(baseColor: string) {
	if (!baseColor.startsWith("#")) throw new Error("baseColor must be a hex color string");

	const { schemes } = themeFromSourceColor(argbFromHex(baseColor));

	const variables: Record<ColorScheme, Record<string, string>> = { dark: {}, light: {} };

	for (const [scheme, entries] of Object.entries(schemes)) {
		for (const [name, value] of Object.entries(entries)) {
			const kebabName = name.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
			const variableName = `--${kebabName}`;

			variables[scheme as ColorScheme][variableName] = toRGBString(value);
		}
	}

	return variables;
}

export function injectIntoRoot(variables: ReturnType<typeof createThemeFromBaseColor>) {
	function createRootString(variables: Record<string, string>) {
		return Object.entries(variables)
			.map(([name, value]) => `${name}: ${value};`)
			.join("\n");
	}

	const code = `
	:root {
		${createRootString(variables.light)}
	}
	
	@media (prefers-color-scheme: dark) {
		:root {
			${createRootString(variables.dark)}
		}
	}

	body {
		background-color: rgb(var(--background) / 1); 
		color: rgb(var(--on-background) / 1);
		overflow-x: hidden;
	}

	*::selection {
		background-color: rgb(var(--tertiary) / 1);
		color: rgb(var(--on-tertiary) / 1);
	}
	`;

	// eslint-disable-next-line node/prefer-global/buffer
	return transform({ filename: "index.css", code: Buffer.from(code), minify: true }).code;
}
