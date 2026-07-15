import { NewsForm } from '@/components/admin/NewsForm';
import { getAllBrandsAdmin } from '@/queries/admin';

export default async function NewNewsPage() {
  const brands = await getAllBrandsAdmin();
  return (
    <div>
      <h1 className="mb-4 text-xl font-bold">New Article</h1>
      <NewsForm brands={brands} />
    </div>
  );
}