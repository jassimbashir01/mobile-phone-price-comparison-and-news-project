import { notFound } from 'next/navigation';
import { PhoneForm } from '@/components/admin/PhoneForm';
import { getPhoneByIdAdmin, getAllBrandsAdmin } from '@/queries/admin';

export default async function EditPhonePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [phone, brands] = await Promise.all([getPhoneByIdAdmin(id), getAllBrandsAdmin()]);
  if (!phone) notFound();

  return (
    <div>
      <h1 className="mb-4 text-xl font-bold">Edit Phone</h1>
      <PhoneForm phone={phone} brands={brands} />
    </div>
  );
}