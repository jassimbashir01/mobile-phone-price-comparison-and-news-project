// Simple in-memory rate limiter — per-server-instance only, resets on
// deploy/restart, and doesn't share state across multiple serverless
// instances. Sufficient to stop casual/automated form spam at current
// traffic levels; not a substitute for a real distributed limiter (e.g.
// Upstash Redis) once traffic genuinely justifies that added dependency.
const submissionLog = new Map<string, number[]>();

export function isRateLimited(key: string, maxPerHour = 5): boolean {
  const now = Date.now();
  const hourAgo = now - 60 * 60 * 1000;
  const timestamps = (submissionLog.get(key) ?? []).filter((t) => t > hourAgo);
  timestamps.push(now);

  if (timestamps.length === 0) {
    submissionLog.delete(key);
  } else {
    submissionLog.set(key, timestamps);
  }

  return timestamps.length > maxPerHour;
}