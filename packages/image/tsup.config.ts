import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["./src/index.tsx"],
	format: ["cjs", "esm"],
	treeshake: true,
	clean: true,
	dts: true,
});
