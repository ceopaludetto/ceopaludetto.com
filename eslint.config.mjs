import { fileURLToPath } from "node:url";

import eslint from "@antfu/eslint-config";
import tailwind from "eslint-plugin-tailwindcss";

export default eslint(
	{
		stylistic: {
			indent: "tab",
			quotes: "double",
			semi: true,
			overrides: {
				"style/arrow-parens": ["error", "always"],
				"style/brace-style": ["error", "1tbs", { allowSingleLine: true }],
				"style/max-len": ["error", { code: 120, tabWidth: 2 }],
			},
		},
		isInEditor: false,
		typescript: {
			overrides: {
				"ts/consistent-type-imports": "off",
				"ts/consistent-type-definitions": ["error", "type"],
				"ts/explicit-member-accessibility": [
					"warn",
					{ accessibility: "explicit" },
				],
				"ts/no-floating-promises": "off",
				"ts/no-misused-promises": "off",
			},
		},
		vue: false,
		astro: true,
	},
	{
		rules: {
			"antfu/if-newline": "off",
			"antfu/no-top-level-await": "off",

			"node/prefer-global/process": "off",

			"perfectionist/sort-imports": [
				"warn",
				{
					type: "alphabetical",
					order: "asc",
					ignoreCase: true,
					groups: [
						"side-effect",
						"type",
						"builtin",
						"external",
						"index",
						["internal", "sibling", "parent"],
						"object",
					],
					internalPattern: ["^~/.*"],
					newlinesBetween: "always",
					environment: "bun",
				},
			],
			"import/consistent-type-specifier-style": ["warn", "prefer-top-level"],
		},
	},
	{
		ignores: [
			// Build artifacts
			"**/dist/**/*",
			"**/build/**/*",
			"**/.turbo/**/*",

			// Modules
			"**/node_modules/**/*",
		],
	},
	...tailwind.configs["flat/recommended"],
	{
		settings: {
			tailwindcss: {
				config: fileURLToPath(new URL("./application/tailwind.config.ts", import.meta.url)),
			},
		},
	},
);
