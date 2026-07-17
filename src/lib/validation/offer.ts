import { z } from 'zod';

const optionalNumber = z.preprocess(
  (val) => (val === '' || val === undefined || val === null ? undefined : val),
  z.coerce.number().optional()
);

export const offerSchema = z.object({
  offer_type: z.enum(['affiliate', 'local_deal']),
  title: z.string().min(2, 'Title is required'),
  description: z.string().max(1000).optional(),
  destination_url: z.string().url('Must be a valid URL'),
  price_pkr: optionalNumber,
  original_price_pkr: optionalNumber,
  shop_name: z.string().max(100).optional(),
  shop_location: z.string().max(100).optional(),
  is_active: z.boolean().default(true),
  sort_order: z.coerce.number().int().default(0),
  expires_at: z.string().optional(),
});

export type OfferFormValues = z.input<typeof offerSchema>;