import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import icon from "astro-icon";
import yaml from "@rollup/plugin-yaml";
import vercel from "@astrojs/vercel/serverless";
import pagefind from "astro-pagefind";

// https://astro.build/config
export default defineConfig({
  site: "https://redaction-technique.org",
  output: "server",          // required for serverless API routes
  adapter: vercel(),         // Vercel serverless adapter
  integrations: [
    pagefind(),
    mdx(),
    sitemap(),
    icon()
  ],
  vite: {
    plugins: [
      yaml(),                // enable YAML imports
      tailwindcss()
    ],
    resolve: {
      alias: {
        "@data": "/data"     // optional: import YAML like '@data/oil-types.yaml'
      }
    }
  }
});
