import { notFound } from 'next/navigation';
import { PhoneForm } from '@/components/admin/PhoneForm';
import { ExtendedSpecsForm } from '@/components/admin/ExtendedSpecsForm';
import { getPhoneByIdAdmin, getAllBrandsAdmin, getPhoneExtendedSpecsAdmin } from '@/queries/admin';

export default async function EditPhonePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [phone, brands, extendedSpecs] = await Promise.all([
    getPhoneByIdAdmin(id),
    getAllBrandsAdmin(),
    getPhoneExtendedSpecsAdmin(id),
  ]);
  if (!phone) notFound();

  return (
    <div className="space-y-10">
      <div>
        <h1 className="mb-4 text-xl font-bold">Edit Phone</h1>
        <PhoneForm phone={phone} brands={brands} />
      </div>

      <div>
        <h1 className="mb-4 text-xl font-bold">Full Specifications (public spec table)</h1>
        <ExtendedSpecsForm phoneId={phone.id} phoneSlug={phone.slug} initialValues={extendedSpecs} />
      </div>
    </div>
  );
}