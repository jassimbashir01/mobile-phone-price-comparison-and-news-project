import { formatPKR, formatUSDFromPKR } from '@/lib/utils';

export function PriceDisplay({ pricePkr, exchangeRate }: { pricePkr: number | null; exchangeRate: number }) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="text-2xl font-bold text-primary">{formatPKR(pricePkr)}</span>
      {pricePkr != null && (
        <span className="text-sm text-ink/50">≈ {formatUSDFromPKR(pricePkr, exchangeRate)}</span>
      )}
    </div>
  );
}