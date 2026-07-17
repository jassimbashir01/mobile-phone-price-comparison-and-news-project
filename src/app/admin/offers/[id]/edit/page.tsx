import { notFound } from 'next/navigation';
import { OfferForm } from '@/components/admin/OfferForm';
import { getOfferByIdAdmin } from '@/queries/admin';

export default async function EditOfferPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const offer = await getOfferByIdAdmin(id);
  if (!offer) notFound();

  return (
    <div>
      <h1 className="mb-4 text-xl font-bold">Edit Offer</h1>
      <OfferForm offer={offer} />
    </div>
  );
}