import { notFound } from 'next/navigation';
import { BrandForm } from '@/components/admin/BrandForm';
import { getBrandByIdAdmin } from '@/queries/admin';

export default async function EditBrandPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const brand = await getBrandByIdAdmin(id);
  if (!brand) notFound();

  return (
    <div>
      <h1 className="mb-4 text-xl font-bold">Edit Brand</h1>
      <BrandForm brand={brand} />
    </div>
  );
}