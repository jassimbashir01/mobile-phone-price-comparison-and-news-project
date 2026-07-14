import { z } from 'zod';

export const brandSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  slug: z.string().min(2, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Lowercase letters, numbers, hyphens only'),
  logo_url: z.string().url('Must be a valid URL').or(z.literal('')).optional(),
  description: z.string().max(500).optional(),
  is_active: z.boolean(),
});

export type BrandFormValues = z.infer<typeof brandSchema>;