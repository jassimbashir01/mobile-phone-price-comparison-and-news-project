'use client';

import { useRouter } from 'next/navigation';
import { DeleteButton } from './DeleteButton';
import { deleteOffer } from '@/lib/actions/offers';

export function OfferDeleteButton({ id, isAdmin }: { id: string; isAdmin: boolean }) {
  const router = useRouter();
  return (
    <DeleteButton
      isAdmin={isAdmin}
      onDelete={async () => {
        await deleteOffer(id);
        router.refresh();
      }}
    />
  );
}