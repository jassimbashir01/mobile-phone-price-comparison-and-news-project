import { z } from 'zod';

export const emailCaptureSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  source: z.string().default('homepage'),
});

export type EmailCaptureValues = z.infer<typeof emailCaptureSchema>;