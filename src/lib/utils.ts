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

/**
 * Formats an offer's expiry for display in Pakistan time.
 *
 * expires_at is a timestamptz (an absolute UTC instant), so an explicit
 * timeZone is required — otherwise the server formats in its own zone and a
 * visitor in Karachi sees a time that doesn't match what the admin set.
 *
 * Returns null when there's no expiry or the date is unparseable, so callers
 * can render nothing rather than an empty label.
 */
export function formatOfferExpiry(
  expiresAt: string | null | undefined,
): { label: string; isEndingSoon: boolean } | null {
  if (!expiresAt) return null;

  const date = new Date(expiresAt);
  if (Number.isNaN(date.getTime())) return null;

  const msRemaining = date.getTime() - Date.now();
  if (msRemaining <= 0) return null; // already expired — the query filters
                                     // these out, but a cached page might
                                     // still hold one

  const label = new Intl.DateTimeFormat("en-PK", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Karachi",
  }).format(date);

  // Under 48 hours gets the urgency treatment. Chosen because the offers
  // page caches for an hour — a tighter window (say 6h) would be wrong for
  // up to a sixth of its life.
  return { label, isEndingSoon: msRemaining < 48 * 60 * 60 * 1000 };
}