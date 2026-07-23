import { z } from "zod";

const optionalNumber = z.preprocess(
  (val) => (val === "" || val === undefined || val === null ? undefined : val),
  z.coerce.number().optional(),
);

// Same reasoning as settings.ts's httpUrlSchema — z.string().url() alone
// accepts javascript: and other unsafe schemes, since they're
// syntactically valid URLs. This field renders as a live href on every
// public /offers card, so it needs the same restriction.
const httpUrlSchema = z.string().refine((val) => /^https?:\/\//i.test(val), {
  message: "Must be a valid https:// or http:// URL",
});

export const offerSchema = z.object({
  offer_type: z.enum(["affiliate", "local_deal"]),
  title: z.string().min(2, "Title is required"),
  description: z.string().max(1000).optional(),
  destination_url: httpUrlSchema,
  price_pkr: optionalNumber,
  original_price_pkr: optionalNumber,
  shop_name: z.string().max(100).optional(),
  shop_location: z.string().max(100).optional(),
  is_active: z.boolean().default(true),
  sort_order: z.coerce.number().int().default(0),
  expires_at: z.string().optional(),
});

export type OfferFormValues = z.input<typeof offerSchema>;
