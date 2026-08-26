import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * One MDX file per written lesson, at src/content/lessons/<course>/<lesson>.mdx
 * so the entry id matches the syllabus slugs exactly.
 */
const lessons = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/lessons' }),
  schema: z.object({
    /** The single sentence that opens the lesson. If you read nothing else. */
    oneThing: z.string(),
    /** Rough reading time in minutes. Kept honest, not padded. */
    minutes: z.number().min(1).max(9).default(4),
    /** Jargon introduced here, in plain words. */
    terms: z
      .array(
        z.object({
          term: z.string(),
          plain: z.string(),
        }),
      )
      .default([]),
    /** Exactly four check-yourself questions per lesson. */
    quiz: z
      .array(
        z.object({
          question: z.string(),
          choices: z.array(z.string()).min(2).max(4),
          answer: z.number().int().min(0),
          because: z.string(),
        }),
      )
      .length(4),
  }),
});

export const collections = { lessons };
