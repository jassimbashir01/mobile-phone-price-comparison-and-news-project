import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatPKR(amount: number | null): string {
  if (amount === null) return 'Price Unavailable';
  return `Rs. ${amount.toLocaleString('en-PK')}`;
}

export function formatUSD(amount: number | null): string {
  if (amount === null) return '';
  return `$${amount.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
}