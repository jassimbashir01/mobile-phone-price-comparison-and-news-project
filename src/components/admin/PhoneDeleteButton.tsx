'use client';

import { useRouter } from 'next/navigation';
import { DeleteButton } from './DeleteButton';
import { deletePhone } from '@/lib/actions/phones';

export function PhoneDeleteButton({ id, slug, isAdmin }: { id: string; slug: string; isAdmin: boolean }) {
  const router = useRouter();
  return (
    <DeleteButton
      isAdmin={isAdmin}
      onDelete={async () => {
        await deletePhone(id, slug);
        router.refresh();
      }}
    />
  );
}