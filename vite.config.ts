import { defineConfig } from "vite-plus";

export default defineConfig({
  pack: [
    {
      entry: ["src/**/*.ts"],
      root: "src",
      unbundle: true,
      format: ["esm"],
      outDir: "mjs",
      target: "es2023",
      dts: true,
      sourcemap: true,
      outExtensions: () => ({ js: ".js", dts: ".d.ts" }),
    },
    {
      entry: ["src/**/*.ts"],
      root: "src",
      unbundle: true,
      format: ["cjs"],
      outDir: "cjs",
      // Keep the tracked package.json that marks .js files as CommonJS.
      clean: ["cjs/**/*.js", "cjs/**/*.d.ts", "cjs/**/*.map"],
      target: "es2023",
      dts: true,
      sourcemap: true,
      outExtensions: () => ({ js: ".js", dts: ".d.ts" }),
    },
  ],
  fmt: {
    printWidth: 80,
    tabWidth: 2,
    useTabs: false,
    singleQuote: false,
    sortImports: true,
    sortPackageJson: false,
    ignorePatterns: ["cjs/**", "mjs/**", "tests/data/**", "data/**"],
  },
});
