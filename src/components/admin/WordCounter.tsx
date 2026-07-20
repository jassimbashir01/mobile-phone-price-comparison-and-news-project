export function WordCounter({ text, target }: { text: string; target?: string }) {
  const plainText = text.replace(/<[^>]*>/g, ' ').trim();
  const wordCount = plainText ? plainText.split(/\s+/).length : 0;

  return (
    <span className="text-[10px] text-ink/40">
      {wordCount} word{wordCount === 1 ? '' : 's'}
      {target && <span className="ml-1">· target: {target}</span>}
    </span>
  );
}