/**
 * Ensures a string is valid HTML for rendering in prose containers.
 * Converts plain text (no HTML tags) into paragraphs.
 */
export function ensureHtml(text: string | null | undefined): string {
  if (!text) return '';
  // If it already contains HTML tags, return as-is
  if (/<[a-z][\s\S]*>/i.test(text)) return text;
  // Convert plain text lines into paragraphs
  return text
    .split('\n')
    .filter((line) => line.trim())
    .map((line) => `<p>${line}</p>`)
    .join('');
}
