// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only), VITE_* env injection, @ path alias, React/TanStack dedupe, error logger
//     plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { existsSync } from "node:fs";
import process from "node:process";
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

const envFile = new URL("./.env", import.meta.url);
if (existsSync(envFile)) process.loadEnvFile(envFile);

// Vercel builds its own runtime: it needs Nitro's Build Output API artifact in
// .vercel/output, not a Node server. Vercel sets VERCEL=1 during every build, so
// the same repository can also be deployed to a plain Node.js host (Plesk,
// 001.africa) where .output/server/index.mjs is what has to run.
const onVercel =
  Boolean(process.env["VERCEL"]) ||
  process.env["DEPLOY_TARGET"] === "vercel" ||
  process.env["NITRO_PRESET"] === "vercel";

export default defineConfig({
  nitro: { preset: onVercel ? "vercel" : "node-server" },
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
});
