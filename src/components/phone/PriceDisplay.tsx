import { formatPKR, formatUSDFromPKR } from "@/lib/utils";

export function PriceDisplay({
  pricePkr,
  exchangeRate,
}: {
  pricePkr: number | null;
  exchangeRate: number;
}) {
  if (pricePkr == null) {
    return (
      <div className="flex items-baseline gap-2">
        <span className="rounded bg-ink/10 px-2 py-1 text-sm font-semibold text-ink/50">
          Price N/A
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-baseline gap-2">
      <span className="text-2xl font-bold text-primary">
        {formatPKR(pricePkr)}
      </span>
      <span className="text-sm text-ink/50">
        ≈ {formatUSDFromPKR(pricePkr, exchangeRate)}
      </span>
    </div>
  );
}
