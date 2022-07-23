import { defineConfig } from "unocss";

import presetAttributify from "@unocss/preset-attributify";
import presetUno from "@unocss/preset-uno";

export default defineConfig({
  rules: [
    [
      /^bg-url\[(.*?)\]$/,
      ([, url]) => ({ "background-image": `url('${url}')` }),
    ],
    [
      /^letter-spacing-(\d+)$/,
      ([, d]) => ({ "letter-spacing": `${d / 16}rem` }),
    ],
  ],
  presets: [presetAttributify(), presetUno()],
  theme: {
    colors: {
      secondaryDark: "#001219",
      secondary: "#005f73",
      secondaryLight: "#0a9396",
      secondaryHighlight: "#94d2bd",
      background: "#f8f8ff",
      primaryHightlight: "#ee9b00",
      primaryLight: "#bb3e03",
      primary: "#ae2012",
      primaryDark: "#9b2226",
    },
  },
});
