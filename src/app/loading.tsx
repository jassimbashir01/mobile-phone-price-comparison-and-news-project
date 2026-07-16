export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="animate-pulse space-y-5">
        <div className="h-6 w-48 rounded-md bg-border" />

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }, (_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-lg border border-border bg-white"
            >
              <div className="aspect-square bg-border" />

              <div className="space-y-2 p-3">
                <div className="h-4 w-3/4 rounded bg-border" />
                <div className="h-3 w-1/2 rounded bg-border" />
                <div className="h-4 w-2/5 rounded bg-border" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}