import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export function AdminSuccessScreen({
  title,
  message,
  primaryHref,
  primaryLabel,
  createAnotherHref,
  createAnotherLabel,
  onCreateAnother,
}: {
  title: string;
  message: string;
  primaryHref: string;
  primaryLabel: string;
  createAnotherHref: string;
  createAnotherLabel: string;
  // When provided, "create another" resets local state instead of
  // navigating — needed because these success screens render on the
  // exact same URL as their own "create another" link, so a normal
  // navigation to that URL is a no-op and never remounts the form.
  onCreateAnother?: () => void;
}) {
  return (
    <div className="rounded-lg border border-primary bg-primary-light p-8 text-center">
      <CheckCircle2 className="mx-auto mb-3 text-primary" size={40} />
      <h2 className="mb-1 text-lg font-bold text-primary-dark">{title}</h2>
      <p className="mb-6 text-sm text-primary-dark/80">{message}</p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link
          href={primaryHref}
          className="rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark"
        >
          {primaryLabel}
        </Link>
        {onCreateAnother ? (
          <button
            onClick={onCreateAnother}
            className="rounded-md border border-primary px-5 py-2.5 text-sm font-semibold text-primary hover:bg-white"
          >
            {createAnotherLabel}
          </button>
        ) : (
          <Link
            href={createAnotherHref}
            className="rounded-md border border-primary px-5 py-2.5 text-sm font-semibold text-primary hover:bg-white"
          >
            {createAnotherLabel}
          </Link>
        )}
      </div>
    </div>
  );
}
