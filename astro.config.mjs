import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import icon from "astro-icon";
import yaml from "@rollup/plugin-yaml"; // 👈 add this

// https://astro.build/config
export default defineConfig({
  site: "https://astroship.web3templates.com",
  integrations: [mdx(), sitemap(), icon()],
  vite: {
    plugins: [
      tailwindcss(),
      yaml(), // 👈 enable YAML import support
    ],
  },
});
