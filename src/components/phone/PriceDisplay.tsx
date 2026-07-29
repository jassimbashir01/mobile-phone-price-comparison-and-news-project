import { formatPKR, formatUSDFromPKR } from "@/lib/utils";

export function PriceDisplay({
  pricePkr,
  expectedPricePkr,
  status,
  exchangeRate,
}: {
  pricePkr: number | null;
  expectedPricePkr?: number | null;
  status?: "available" | "coming_soon" | "discontinued";
  exchangeRate: number;
}) {
  if (status === "coming_soon") {
    if (expectedPricePkr != null) {
      return (
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-primary">
            {formatPKR(expectedPricePkr)}
          </span>
          <span className="rounded bg-accent px-1.5 py-0.5 text-[10px] font-semibold">
            Expected
          </span>
        </div>
      );
    }
    return (
      <div className="flex items-baseline gap-2">
        <span className="rounded bg-ink/10 px-2 py-1 text-sm font-semibold text-ink/50">
          Coming Soon
        </span>
      </div>
    );
  }

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
