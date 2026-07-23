import DOMPurify from 'isomorphic-dompurify';

const ALLOWED_TAGS = ['p', 'h2', 'h3', 'h4', 'strong', 'em', 'ul', 'ol', 'li', 'a', 'blockquote', 'br'];
const ALLOWED_ATTR = ['href', 'rel', 'target'];
// Restricts href to http(s) only, matching the httpUrlSchema pattern used
// elsewhere in the project — DOMPurify's own defaults already block
// javascript: here, this just narrows the *allowed* set explicitly rather
// than relying on the library's broader default allowlist (mailto:, tel:,
// etc. would otherwise also pass through unremarked).
const ALLOWED_URI_REGEXP = /^https?:\/\//i;

export function sanitizeRichText(html: string | null | undefined): string {
  if (!html) return '';
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOWED_URI_REGEXP,
  });
}