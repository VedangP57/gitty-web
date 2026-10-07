import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { docsLoader, i18nLoader } from "@astrojs/starlight/loaders";
import { docsSchema, i18nSchema } from "@astrojs/starlight/schema";

export const collections = {
  docs: defineCollection({ loader: docsLoader(), schema: docsSchema() }),
  i18n: defineCollection({ loader: i18nLoader(), schema: i18nSchema() }),
  blog: defineCollection({
    loader: glob({ pattern: "*.md", base: "./src/content/blog" }),
    schema: z.object({
      title: z.string().max(70),
      description: z.string().max(160),
      date: z.coerce.date(),
      updated: z.coerce.date().optional(),
      kind: z.enum(["howto", "engineering", "comparison", "guide"]),
      tags: z.array(z.string()).default([]),
      order: z.number().default(999),
      draft: z.boolean().default(false),
    }),
  }),
};
