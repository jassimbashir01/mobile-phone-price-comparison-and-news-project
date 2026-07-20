import { CONTENT_GUIDANCE } from '@/lib/contentGuidance';

export function ContentGuidancePanel() {
  return (
    <section className="rounded-lg border border-border bg-white p-4">
      <h2 className="mb-1 text-sm font-bold">Content Length Guidance</h2>
      <div className="space-y-3">
        {CONTENT_GUIDANCE.map((g) => (
          <div key={g.context} className="rounded-md border border-border bg-surface p-3">
            <div className="mb-1 flex flex-wrap items-baseline justify-between gap-x-3">
              <span className="text-sm font-semibold">{g.context}</span>
              <span className="text-xs font-medium text-primary">{g.recommendedWords}</span>
            </div>
            <p className="text-xs text-ink/60">{g.note}</p>
          </div>
        ))}
      </div>
    </section>
  );
}