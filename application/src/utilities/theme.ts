import { argbFromHex, Hct, rgbaFromArgb, SchemeFidelity } from "@material/material-color-utilities";
import { transform } from "lightningcss";

type ColorScheme = "dark" | "light";

function toRGBString(value: number) {
	const { r, g, b } = rgbaFromArgb(value);
	return [r, g, b].join(" ");
}

/// keep-sorted
export const allColors = [
	"background",
	"error",
	"errorContainer",
	"inverseOnSurface",
	"inversePrimary",
	"inverseSurface",
	"onBackground",
	"onError",
	"onErrorContainer",
	"onPrimary",
	"onPrimaryContainer",
	"onPrimaryFixed",
	"onPrimaryFixedVariant",
	"onSecondary",
	"onSecondaryContainer",
	"onSecondaryFixed",
	"onSecondaryFixedVariant",
	"onSurface",
	"onSurfaceVariant",
	"onTertiary",
	"onTertiaryContainer",
	"onTertiaryFixed",
	"onTertiaryFixedVariant",
	"outline",
	"outlineVariant",
	"primary",
	"primaryContainer",
	"primaryFixed",
	"primaryFixedDim",
	"scrim",
	"secondary",
	"secondaryContainer",
	"secondaryFixed",
	"secondaryFixedDim",
	"shadow",
	"surface",
	"surfaceBright",
	"surfaceContainer",
	"surfaceContainerHigh",
	"surfaceContainerHighest",
	"surfaceContainerLow",
	"surfaceContainerLowest",
	"surfaceDim",
	"surfaceTint",
	"surfaceVariant",
	"tertiary",
	"tertiaryContainer",
	"tertiaryFixed",
	"tertiaryFixedDim",
] as const;

export function createThemeFromBaseColor(baseColor: string) {
	if (!baseColor.startsWith("#")) throw new Error("baseColor must be a hex color string");

	const schemes = {
		light: new SchemeFidelity(Hct.fromInt(argbFromHex(baseColor)), false, 0),
		dark: new SchemeFidelity(Hct.fromInt(argbFromHex(baseColor)), true, 0),
	};

	const variables: Record<ColorScheme, Record<string, string>> = { dark: {}, light: {} };

	for (const [scheme, entries] of Object.entries(schemes)) {
		for (const name of allColors) {
			const kebabName = name.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
			const variableName = `--${kebabName}`;

			variables[scheme as ColorScheme][variableName] = toRGBString(entries[name]);
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
