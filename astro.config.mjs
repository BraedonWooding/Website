import { defineConfig } from "astro/config";
import preact from "@astrojs/preact";
import UnoCss from "unocss/vite";
import svelte from "@astrojs/svelte";

// https://astro.build/config
export default defineConfig({
  markdown: {
    drafts: true,
  },
  integrations: [preact(), svelte(), {
    name: "@astrojs/unocss",
    hooks: {
      "astro:config:setup": async ({ config, injectScript }) => {
        injectScript("page", `import '/src/styles/uno.css';`);
      },
    },
  }],
  vite: {
    plugins: [
      UnoCss(),
    ],
  },
});
