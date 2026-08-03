export const metadata = { title: "Offline" };

export default function OfflinePage() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 text-center">
      <h1 className="mb-2 text-xl font-bold">You&apos;re offline</h1>
      <p className="text-sm text-ink/60">
        Check your connection and try again. Pages you&apos;ve already visited
        are still available.
      </p>
    </div>
  );
}
