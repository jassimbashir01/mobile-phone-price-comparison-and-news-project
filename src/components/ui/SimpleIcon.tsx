export function SimpleIcon({ path, size = 16, className }: { path: string; size?: number; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true" className={className}>
      <path d={path} />
    </svg>
  );
}