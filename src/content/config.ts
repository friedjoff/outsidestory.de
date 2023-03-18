import { defineCollection, z } from "astro:content";

const tourCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    date: z.date(),
    description: z.string(),
    photos: z.string().optional(),
    video: z.string().optional(),
    draft: z.boolean().optional(),
    legacy: z.boolean().optional(),
  }),
});

export const collections = {
  tour: tourCollection,
};
