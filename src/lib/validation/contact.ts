import { z } from 'zod';

export const contactSchema = z.object({
  inquiry_type: z.enum(['general', 'feedback', 'price_correction', 'partnership', 'press', 'other']),
  name: z.string().min(2, 'Please enter your name').max(100),
  email: z.string().email('Please enter a valid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000),
});

export type ContactFormValues = z.infer<typeof contactSchema>;