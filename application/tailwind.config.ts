import type { Config } from "tailwindcss";

import { argbFromHex } from "@material/material-color-utilities";
import typography from "@tailwindcss/typography";
import { themeFromSourceColor } from "mcu-extra";
import defaultTheme from "tailwindcss/defaultTheme";

function createThemeFromBaseColor(baseColor: string) {
	if (!baseColor.startsWith("#")) throw new Error("baseColor must be a hex color string");

	const { schemes } = themeFromSourceColor(argbFromHex(baseColor));
	const colors: Map<string, string> = new Map();

	for (const entries of Object.values(schemes)) {
		for (const name of Object.keys(entries)) {
			const kebabName = name.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
			const variableName = `--${kebabName}`;

			colors.set(kebabName, `rgb(var(${variableName}) / <alpha-value>)`);
		}
	}

	return Object.fromEntries(colors);
}

const typographyTokens = {
	"body-large": { lineHeight: 24, size: 16, tracking: 0.5, weight: 400 },
	"body-medium": { lineHeight: 20, size: 14, tracking: 0.25, weight: 400 },
	"body-small": { lineHeight: 16, size: 12, tracking: 0.4, weight: 400 },
	"display-large": { lineHeight: 64, size: 57, tracking: 0, weight: 400 },
	"display-medium": { lineHeight: 52, size: 45, tracking: 0, weight: 400 },
	"display-small": { lineHeight: 44, size: 36, tracking: 0, weight: 400 },
	"headline-large": { lineHeight: 40, size: 32, tracking: 0, weight: 400 },
	"headline-medium": { lineHeight: 36, size: 28, tracking: 0, weight: 400 },
	"headline-small": { lineHeight: 32, size: 24, tracking: 0, weight: 400 },
	"label-large": { lineHeight: 20, size: 14, tracking: 0.1, weight: 500 },
	"label-medium": { lineHeight: 16, size: 12, tracking: 0.5, weight: 500 },
	"label-small": { lineHeight: 16, size: 11, tracking: 0.5, weight: 500 },
	"title-large": { lineHeight: 28, size: 22, tracking: 0, weight: 400 },
	"title-medium": { lineHeight: 24, size: 16, tracking: 0.15, weight: 500 },
	"title-small": { lineHeight: 20, size: 14, tracking: 0.1, weight: 500 },

	"icon-small": { lineHeight: 16, size: 18, tracking: 0, weight: 400 },
	"icon-medium": { lineHeight: 16, size: 24, tracking: 0, weight: 400 },
	"icon-large": { lineHeight: 16, size: 36, tracking: 0, weight: 400 },
};

function toRem(value: number) {
	return `${value / 16}rem`;
}

export function createTypographyTokens() {
	return Object.entries(typographyTokens).reduce(
		(acc, [name, value]) => {
			const { size, weight, lineHeight, tracking } = value;
			const definitions = {
				fontWeight: weight.toString(),
				letterSpacing: toRem(tracking),
				lineHeight: toRem(lineHeight),
			};

			acc[name] = [toRem(size), definitions];
			return acc;
		},
		{} as Record<string, [string, { fontWeight: string; letterSpacing: string; lineHeight: string }]>,
	);
}

export default {
	content: ["./src/**/*.{astro,html,ts}"],
	theme: {
		fontSize: createTypographyTokens(),
		fontFamily: {
			sans: ["Poppins", "Poppins fallback", ...defaultTheme.fontFamily.sans],
			serif: ["Lora", "Lora fallback", ...defaultTheme.fontFamily.serif],
			mono: ["Monaspace Neon", "Monaspace Neon fallback", ...defaultTheme.fontFamily.mono],
		},
		extend: {
			colors: createThemeFromBaseColor("#FFC100"),
			typography: ({ theme }: any) => ({
				DEFAULT: {
					css: {
						"--tw-prose-body": theme("colors.on-surface/1"),
						"--tw-prose-headings": theme("colors.on-surface/1"),
						"--tw-prose-lead": theme("colors.pink[700]"),
						"--tw-prose-links": theme("colors.primary/1"),
						"--tw-prose-bold": theme("colors.tertiary/1"),
						"--tw-prose-counters": theme("colors.primary/1"),
						"--tw-prose-bullets": theme("colors.primary/1"),
						"--tw-prose-hr": theme("colors.surface-container-high/1"),
						"--tw-prose-quotes": theme("colors.primary/1"),
						"--tw-prose-quote-borders": theme("colors.surface-container-highest/1"),
						"--tw-prose-captions": theme("colors.pink[700]"),
						"--tw-prose-code": theme("colors.secondary/1"),
						"--tw-prose-th-borders": theme("colors.surface-container-high/1"),
						"--tw-prose-td-borders": theme("colors.surface-container-high/1"),
					},
				},
			}),
		},
	},
	plugins: [typography],
} satisfies Config;
