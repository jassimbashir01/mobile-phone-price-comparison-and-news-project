/**
 * "New" is derived from release_date, never stored.
 *
 * A stored is_new flag would need a job to flip it, which means two sources
 * of truth that can disagree — and a badge that's wrong until the next run.
 * Computing it at read time makes drift impossible.
 *
 * Auto-discontinuing at 24 months IS persisted, because it changes sort
 * order, filtering, and what the admin sees. That's a real state change;
 * this is only a display concern.
 *
 * Exported because queries/brands.ts needs the same window to decide whether
 * a brand has any new phones — defining it twice would let the phone badge
 * and the brand badge silently disagree.
 */
export const NEW_WINDOW_MONTHS = 3;

export function isPhoneNew(releaseDate: string | null | undefined): boolean {
  if (!releaseDate) return false;

  const released = new Date(releaseDate);
  if (Number.isNaN(released.getTime())) return false;

  // Not new if the release date is in the future — an unreleased phone is
  // "coming soon", which the status field already communicates.
  const now = new Date();
  if (released > now) return false;

  const cutoff = new Date(now);
  cutoff.setMonth(cutoff.getMonth() - NEW_WINDOW_MONTHS);
  return released >= cutoff;
}

/**
 * Formats a release date for display. Returns null when unset or
 * unparseable, so callers render nothing rather than an empty label.
 */
export function formatReleaseDate(
  releaseDate: string | null | undefined,
): string | null {
  if (!releaseDate) return null;
  const d = new Date(releaseDate);
  if (Number.isNaN(d.getTime())) return null;
  return new Intl.DateTimeFormat("en-PK", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Karachi",
  }).format(d);
}
