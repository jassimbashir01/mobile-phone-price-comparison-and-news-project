import DOMPurify from 'isomorphic-dompurify';

const ALLOWED_TAGS = ['p', 'h2', 'h3', 'h4', 'strong', 'em', 'ul', 'ol', 'li', 'a', 'blockquote', 'br'];
const ALLOWED_ATTR = ['href', 'rel', 'target'];

export function sanitizeRichText(html: string | null | undefined): string {
  if (!html) return '';
  return DOMPurify.sanitize(html, { ALLOWED_TAGS, ALLOWED_ATTR });
}