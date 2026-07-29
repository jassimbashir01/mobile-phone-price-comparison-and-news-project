import { z } from "zod";

export const brandSchema = z.object({
  name: z.string().min(2, "Name is required"),
  slug: z
    .string()
    .min(2, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers, hyphens only"),
  logo_url: z.string().optional(),
  description: z.string().max(500).optional(),
  is_active: z.boolean(),
  show_in_sidebar: z.boolean().default(true),
});

export type BrandFormValues = z.input<typeof brandSchema>;
