import { defineConfig } from 'unocss'

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
      "secondary-dark": "#001219",
      secondary: "#005f73",
      "secondary-light": "#0a9396",
      "secondary-highlight": "#94d2bd",
      background: "#f8f8ff",
      "primary-hightlight": "#ee9b00",
      "primary-light": "#bb3e03",
      primary: "#ae2012",
      "primary-dark": "#9b2226",
    },
  },
})