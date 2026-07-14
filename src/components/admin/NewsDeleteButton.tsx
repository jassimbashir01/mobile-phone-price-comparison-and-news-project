'use client';

import { useRouter } from 'next/navigation';
import { DeleteButton } from './DeleteButton';
import { deleteNews } from '@/lib/actions/news';

export function NewsDeleteButton({ id, slug, isAdmin }: { id: string; slug: string; isAdmin: boolean }) {
  const router = useRouter();
  return (
    <DeleteButton
      isAdmin={isAdmin}
      onDelete={async () => {
        await deleteNews(id, slug);
        router.refresh();
      }}
    />
  );
}