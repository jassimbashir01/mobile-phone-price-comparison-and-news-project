import { siFacebook, siInstagram, siX, siYoutube, siTiktok, siWhatsapp } from 'simple-icons';
import { SimpleIcon } from '@/components/ui/SimpleIcon';
import type { SocialLink } from '@/types/database';

const ICONS: Record<SocialLink['platform'], { path: string }> = {
  facebook: siFacebook,
  instagram: siInstagram,
  twitter: siX,
  youtube: siYoutube,
  tiktok: siTiktok,
  whatsapp: siWhatsapp,
};

export function SocialLinksRow({ links }: { links: SocialLink[] }) {
  const active = links.filter((l) => l.enabled && l.url);
  if (active.length === 0) return null;

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-ink/50">Follow us:</span>
      {active.map((link) => (
        <a
          key={link.platform}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Visit our ${link.platform} page`}
          title={link.platform}
          className="rounded-full border border-border p-2 text-ink/60 hover:border-primary hover:text-primary"
        >
          <SimpleIcon path={ICONS[link.platform].path} />
        </a>
      ))}
    </div>
  );
}