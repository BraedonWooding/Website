// structuredData.ts
import { type Article, type Person, type WebSite, type WithContext } from 'schema-dts';
import avatar from '../../public/racoon.png';
import type { CollectionEntry } from 'astro:content';
 
export const blogWebsite: WithContext<WebSite> = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  url: `${import.meta.env.SITE}/blog/`,
  name: 'Braedon Wooding\'s blog',
  description: 'Collection of musings and thoughts',
  inLanguage: 'en_US',
};
 
export const mainWebsite: WithContext<WebSite> = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  url: import.meta.env.SITE,
  name: 'Braedon Wooding\'s blog',
  description: 'Braedon Wooding\'s blog',
  inLanguage: 'en_US',
};
 
export const personSchema: WithContext<Person> = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Braedon Wooding',
  url: 'https://braedonww.me',
  image: `${import.meta.env.SITE}${avatar.src}`,
  sameAs: [
    'https://github.com/BraedonWooding'
  ],
  jobTitle: 'Software Engineer',
  worksFor: {
    '@type': 'Organization',
    name: 'Resonate Solutions',
    url: 'https://resonate.cx',
  },
};
 
export function getArticleSchema(post: CollectionEntry<'blog'>) {
  const articleStructuredData: WithContext<Article> = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.data.title,
    url: `${import.meta.env.SITE}/blog/${post.slug}/`,
    description: post.data.description,
    datePublished: post.data.publishDate.toString(),
    publisher: {
      '@type': 'Person',
      name: 'Braedon Wooding',
      url: import.meta.env.SITE,
      image: import.meta.env.SITE + avatar.src,
    },
    author: {
      '@type': 'Person',
      name: 'Braedon Wooding',
      url: import.meta.env.SITE,
      image: import.meta.env.SITE + avatar.src,
    },
  };
  return articleStructuredData;
}