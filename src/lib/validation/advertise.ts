import { z } from 'zod';

export const advertiseInquirySchema = z.object({
  name: z.string().min(2, 'Please enter your name'),
  email: z.string().email('Please enter a valid email address'),
  company: z.string().min(2, "Please enter your company or shop name"),
  placement: z.enum([
    'homepage-banner',
    'sidebar-banner',
    'featured-phone',
    'featured-price-range',
    'brand-showcase',
    'other',
  ]),
  message: z.string().min(10, "Please add a few details about what you're looking for").max(2000),
});

export type AdvertiseInquiryValues = z.infer<typeof advertiseInquirySchema>;