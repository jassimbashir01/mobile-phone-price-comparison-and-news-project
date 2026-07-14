import { notFound } from 'next/navigation';
import { NewsForm } from '@/components/admin/NewsForm';
import { getNewsByIdAdmin, getAllBrandsAdmin } from '@/queries/admin';

export default async function EditNewsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [news, brands] = await Promise.all([getNewsByIdAdmin(id), getAllBrandsAdmin()]);
  if (!news) notFound();

  return (
    <div>
      <h1 className="mb-4 text-xl font-bold">Edit Article</h1>
      <NewsForm news={news} brands={brands} />
    </div>
  );
}