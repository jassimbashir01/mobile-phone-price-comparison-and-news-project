import { z } from 'zod';

export const newsSchema = z.object({
  brand_id: z.string().uuid().or(z.literal('')).optional(),
  title: z.string().min(3, 'Title is required'),
  slug: z.string().min(3).regex(/^[a-z0-9-]+$/, 'Lowercase letters, numbers, hyphens only'),
  excerpt: z.string().max(300).optional(),
  body: z.string().min(20, 'Body must be at least 20 characters'),
  is_published: z.boolean(),
  published_at: z.string().optional(),
});

export type NewsFormValues = z.infer<typeof newsSchema>;