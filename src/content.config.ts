import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string(),
    year: z.number(),
    status: z.enum(['已上架', '可体验', '可阅读', '生产中', '内测中', '原型', '探索', '归档', '暂停']),
    category: z.string().optional(),
    featured: z.boolean().default(false),
    format: z.enum(['project', 'comic']).default('project'),
    group: z.enum(['apps', 'games', 'reading', 'creations']),
    cover: z.object({
      src: z.string().startsWith('/images/projects/'),
      alt: z.string(),
    }).optional(),
    video: z.object({
      src: z.string().startsWith('/videos/projects/'),
      poster: z.string().startsWith('/images/projects/'),
      caption: z.string(),
      credits: z.string().startsWith('/videos/projects/'),
    }).optional(),
    stack: z.array(z.string()),
    links: z
      .array(
        z.object({
          label: z.string(),
          href: z.string().url(),
        }),
      )
      .optional(),
    order: z.number().optional(),
    draft: z.boolean().optional().default(false),
  }),
});

export const collections = { projects };
