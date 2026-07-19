import Link from "next/link";
import { getDashboardCounts } from "@/queries/admin";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const counts = await getDashboardCounts();

  const cards = [
    { label: "Phones", value: counts.phones, href: "/admin/phones" },
    { label: "Brands", value: counts.brands, href: "/admin/brands" },
    { label: "News Articles", value: counts.news, href: "/admin/news" },
    {
      label: "Contact Messages",
      value: counts.messages,
      href: "/admin/messages",
    },
  ];

  return (
    <div>
      <h1 className="mb-4 text-xl font-bold">Admin Dashboard</h1>
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="rounded-lg border border-border bg-white p-4 hover:border-primary"
          >
            <p className="text-2xl font-bold text-primary">{c.value}</p>
            <p className="text-xs text-ink/60">{c.label}</p>
          </Link>
        ))}
      </div>
      <div className="flex flex-wrap gap-3">
        <Link
          href="/admin/phones/new"
          className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark"
        >
          + Add Phone
        </Link>
        <Link
          href="/admin/news/new"
          className="rounded-md border border-border px-4 py-2 text-sm hover:border-primary"
        >
          + Add News Article
        </Link>
        <Link
          href="/admin/brands/new"
          className="rounded-md border border-border px-4 py-2 text-sm hover:border-primary"
        >
          + Add Brand
        </Link>
        <Link
          href="/admin/featured"
          className="rounded-md border border-border px-4 py-2 text-sm hover:border-primary"
        >
          Manage Featured Sections
        </Link>
      </div>
    </div>
  );
}
