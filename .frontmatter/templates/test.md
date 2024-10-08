---
title: Hello world!
subTitle: My new blogging platform is live
publishDate: 2022-07-23
author: Braedon Wooding
description: New blogging platform with some cool tricks
categories:
  - Website
languages:
  - Typescript
technologies:
  - Astro
  - UnoCSS
keywords: []
---
<h4 text-center> :sparkles: My blog and portfolio platform is live! :sparkles: </h4>

After a couple weeks of tinkering away at ideas and themes, I've finally settled on a system that I love!  I'll likely stil be making changes to it over the next few months, but it's a good starting point.

> I am interested in opinions on the aesthetics of the site so feel free to reach out or reply on hackernews/other sites this may be posted on.

Some of the features of the system I've put together are:

- Fully static, no backend exists
- 0 JavaScript is required for the vast majority of the features of the website
  - The only feature that requires javascript at the moment is the text search feature, this could be changed in the future but that requires a backend
  - Searching through categories/topics/technologies and just browsing through requires and loads minimal JavaScript (and works without it)
  - The only JavaScript we load is to enable nicer transitions between pages (to avoid white flash)
- It's really fast!  We get 100 across all lighthouse scores and it loads in around 0.4s consistently across systems for me.
- No manipulation of index files/manual setup to add a new blog post, I just create a new markdown file and it all works!
- A clean UI design, while in places it's probably a bit over simplified/minimal and I may spruce parts of it up, I like the overall vibe.

The technologies that it uses are:

- Astro, this is what powers the static generation of the website
- UnoCSS, a TailWindCSS alternative (is pretty much just TailWind though)
  - Is a lot more customisable enabling me to add custom rules with ease
- Azure Cloud, is the hosting platform, was just convenient (had some free credits from work visual studio enterprise license)
  - We use a simple static web app which costs 9$ a month
  - A frontdoor (Azure CDN) sits ontop which is a bit more costly at 35$ a month and a ton of extra fees based on the amount of data sent/used.
    - Typically, this is reasonably affordable though.

However, there is quite a bit of custom code to add unique features to this blog.

- Search, this is done entirely client side, so we have to build efficient indexes on blog posts.
  - We have support for quite a few different ways of searching from using IndexedDB (a browser API feature) to web assembly full-text algorithms (with JS fallbacks).
- Reactions, you can react to posts and see other reactions.
- Comments, you can reply to posts and see other comments.
- Frontdoor configuration to add security headers (HSTS/CSP/...).
  - This was quite ridiculously annoying to configure.

> Both reactions & comments have static equivalents

## Why Azure and not Netlify/CloudFlare

Netlify/CloudFlare both offer competitive solutions that I would choose if I had to actually pay for it.  Given, the fact that I get 150$ (USD) a month for free due to having an enterprise visual studio subscription (through work), I wanted to play around with the static app setup and give my thoughts on it.
