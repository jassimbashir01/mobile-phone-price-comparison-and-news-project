import { sanitizeRichText } from '@/lib/sanitize';

export function RichContent({ html }: { html: string | null }) {
  if (!html) return null;
  const clean = sanitizeRichText(html); // re-sanitized at render time too, not just on save

  return <div className="rich-content text-sm leading-relaxed text-ink/80" dangerouslySetInnerHTML={{ __html: clean }} />;
}