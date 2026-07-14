'use client';

import { useRouter } from 'next/navigation';
import { DeleteButton } from './DeleteButton';
import { deleteBrand } from '@/lib/actions/brands';

export function BrandDeleteButton({ id, slug, isAdmin }: { id: string; slug: string; isAdmin: boolean }) {
  const router = useRouter();
  return (
    <DeleteButton
      isAdmin={isAdmin}
      onDelete={async () => {
        await deleteBrand(id, slug);
        router.refresh();
      }}
    />
  );
}