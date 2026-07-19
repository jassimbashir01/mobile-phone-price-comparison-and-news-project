export function SpecDisclaimer({ phoneName }: { phoneName: string }) {
  return (
    <p className="mt-4 rounded-lg border border-border bg-surface p-3 text-xs leading-relaxed text-ink/50">
      Disclaimer. {phoneName} price in Pakistan is updated daily from the
      price list provided by local shops and dealers but we can not
      guarantee that the information / price / {phoneName} prices on this
      page is 100% correct (Human error is possible), always visit your
      local shop for exact cell phone cost &amp; rate. {phoneName} price
      Pakistan.
    </p>
  );
}