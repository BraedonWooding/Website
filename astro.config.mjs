import { defineConfig } from "astro/config";
import preact from "@astrojs/preact";
import UnoCss from "unocss/vite";
import svelte from "@astrojs/svelte";
import mdx from '@astrojs/mdx';
import emoji from 'remark-emoji';

import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: 'https://braedonww.me',
  integrations: [preact(), svelte(), {
    name: "@astrojs/unocss",
    hooks: {
      "astro:config:setup": async ({
        config,
        injectScript
      }) => {
        injectScript("page", `import '/src/styles/uno.css';`);
      }
    }
  }, mdx({
    remarkPlugins: [emoji]
  }), sitemap()],
  vite: {
    build: {
      cssCodeSplit: true,
    },
    plugins: [UnoCss()]
  }
});