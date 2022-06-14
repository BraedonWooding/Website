# My Website

[![Netlify Status](https://api.netlify.com/api/v1/badges/d3fd7591-70ae-4e18-8973-64542610c6c0/deploy-status)](https://app.netlify.com/sites/frabjous-belekoy-65b84e/deploys)

> By Braedon Wooding

> Built using Astro/Unocss

> Note: this code is supplied through the MIT license but the blog posts (and images) themselves are copyright reserved (under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)) requiring attribution, more details in the [License File](./LICENSE.md).

## Commands

All commands are run from the root of the project, from a terminal:

| Command           | Action                                       |
|:----------------  |:-------------------------------------------- |
| `npm install`     | Installs dependencies                        |
| `npm run dev`     | Starts local dev server at `localhost:3000`  |
| `npm run build`   | Build your production site to `./dist/`      |
| `npm run preview` | Preview your build locally, before deploying |

> NOTE: Due to an issue with unocss integration into astro you'll have to run `npm run unocss` to generate the unocss file for production, for dev it just has to exist but won't use it.
