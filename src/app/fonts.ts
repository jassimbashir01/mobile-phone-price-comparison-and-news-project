import { Space_Grotesk, Inter } from 'next/font/google';

export const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

export const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});