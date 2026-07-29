import { z } from "zod";

const optionalNumber = z.preprocess(
  (val) => (val === "" || val === undefined || val === null ? undefined : val),
  z.coerce.number().optional(),
);

export const phoneSchema = z.object({
  brand_id: z.string().uuid("Please select a brand"),
  name: z.string().min(2, "Name is required"),
  slug: z
    .string()
    .min(2, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers and hyphens only"),
  status: z.enum(["available", "coming_soon", "discontinued"]),
  price_pkr: optionalNumber,
  expected_price_pkr: optionalNumber,
  is_featured: z.boolean().default(false),
  sort_order: z.coerce.number().int().default(0),
  seo_description: z.string().max(500).optional(),
  overview: z.string().max(20000).optional(),
  description: z.string().max(50000).optional(),

  network_type: z.string().optional(),
  os: z.string().optional(),
  ram_gb: optionalNumber,
  storage_gb: optionalNumber,
  display_size: optionalNumber,
  main_camera_mp: optionalNumber,
  battery_mah: optionalNumber,
  processor: z.string().optional(),
  display_type: z.string().optional(),
  bluetooth: z.boolean().default(false),
  wifi: z.boolean().default(false),
  dual_sim: z.boolean().default(false),
  fm_radio: z.boolean().default(false),
  memory_card: z.boolean().default(false),
  mp3: z.boolean().default(false),
  video_recording: z.boolean().default(false),
  has_camera: z.boolean().default(false),
});

export type PhoneFormValues = z.input<typeof phoneSchema>;
