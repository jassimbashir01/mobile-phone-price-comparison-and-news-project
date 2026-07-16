import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatPKR(amount: number | null): string {
  if (amount === null) return 'Price Unavailable';
  return `Rs. ${amount.toLocaleString('en-PK')}`;
}

// Replaces the old formatUSD, which expected a manually-entered value.
// Now computed live from PKR × the admin-editable exchange rate.
export function formatUSDFromPKR(pkrAmount: number | null, rate: number | null): string {
  if (pkrAmount === null || rate === null || rate <= 0) return '';
  const usd = pkrAmount / rate;
  return `$${usd.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
}