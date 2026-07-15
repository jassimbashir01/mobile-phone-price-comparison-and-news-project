import { Breadcrumb, type Crumb } from '@/components/layout/Breadcrumb';
import { PhoneGrid } from '@/components/phone/PhoneGrid';
import { Pagination } from '@/components/ui/Pagination';
import { JsonLd } from '@/components/seo/JsonLd';
import { buildBreadcrumbJsonLd, buildItemListJsonLd } from '@/lib/seo';
import type { PhoneCardData } from '@/types/database';
import { siteUrl } from '@/lib/site';

export function CategoryPageContent({
  breadcrumbItems,
  title,
  description,
  phones,
  total,
  page,
  limit,
  basePath,
}: {
  breadcrumbItems: Crumb[];
  title: string;
  description?: string;
  phones: PhoneCardData[];
  total: number;
  page: number;
  limit: number;
  basePath: string;
}) {
  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div>
      <JsonLd data={buildBreadcrumbJsonLd(breadcrumbItems, siteUrl)} />
      {phones.length > 0 && <JsonLd data={buildItemListJsonLd(phones, siteUrl)} />}
      <Breadcrumb items={breadcrumbItems} />
      <h1 className="mb-2 text-xl font-bold">{title}</h1>
      {description && <p className="mb-4 text-sm text-ink/60">{description}</p>}
      <p className="mb-4 text-xs text-ink/40">{total} phones found</p>
      <PhoneGrid phones={phones} />
      <Pagination basePath={basePath} currentPage={page} totalPages={totalPages} />
    </div>
  );
}