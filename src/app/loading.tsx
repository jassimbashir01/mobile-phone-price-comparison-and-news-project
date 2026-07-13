export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="animate-pulse space-y-4">
        <div className="h-6 w-48 rounded bg-border" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-square rounded-lg bg-border" />
          ))}
        </div>
      </div>
    </div>
  );
}