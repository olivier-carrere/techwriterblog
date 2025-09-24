import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import icon from "astro-icon";
import yaml from "@rollup/plugin-yaml";
import vercel from "@astrojs/vercel/serverless"; // ✅ add this

// https://astro.build/config
export default defineConfig({
  site: "https://astroship.web3templates.com",
  output: "server",
  adapter: vercel(), // ✅ tell Astro to build for Vercel
  integrations: [mdx(), sitemap(), icon()],
  vite: {
    plugins: [
      tailwindcss(),
      yaml(),
    ],
  },
});
