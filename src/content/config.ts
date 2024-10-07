import { defineCollection, z } from 'astro:content';

const postsCollection = defineCollection({
  type: 'content',
  schema: ({ }) =>
    z.object({
      title: z.string(),
      subTitle: z.string(),
      publishDate: z.optional(z.coerce.date()),
      author: z.string(),
      description: z.string(),
      draft: z.optional(z.boolean()),
      categories: z.array(z.string()),
      languages: z.array(z.string()),
      technologies: z.array(z.string()),
    }),
});
 
export const collections = {
  blog: postsCollection,
};
