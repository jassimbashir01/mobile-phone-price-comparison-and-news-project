import Link from 'next/link';
import CloudinaryImage from '@/components/cloudinary-image';

interface NewsCardItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  cover_image_public_id: string | null;
  published_at: string | null;
  brand?: { name: string } | null;
}

export function NewsCard({ item }: { item: NewsCardItem }) {
  return (
    <Link
      href={`/news/${item.slug}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-border bg-white transition hover:shadow-md"
    >
      <div className="relative aspect-video bg-surface">
        {item.cover_image_public_id ? (
          <CloudinaryImage
            src={item.cover_image_public_id}
            alt={item.title}
            width={640}
            height={360}
            sizes="(max-width: 768px) 100vw, 33vw"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-ink/30">
            No image
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3">
        {item.brand && <span className="text-[10px] text-ink/50">{item.brand.name}</span>}
        <h3 className="line-clamp-2 text-sm font-semibold group-hover:text-primary">
          {item.title}
        </h3>
        {item.excerpt && (
          <p className="line-clamp-2 text-xs text-ink/60">{item.excerpt}</p>
        )}
        {item.published_at && (
          <p className="mt-auto pt-1 text-[11px] text-ink/40">
            {new Date(item.published_at).toLocaleDateString('en-PK', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </p>
        )}
      </div>
    </Link>
  );
}