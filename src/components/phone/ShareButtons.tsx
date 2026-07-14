'use client';

import { MessageCircle, Share2 } from 'lucide-react';
import { FaFacebook } from 'react-icons/fa';

export function ShareButtons({ url, title }: { url: string; title: string }) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const links = [
    { label: 'WhatsApp', href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`, Icon: MessageCircle },
    { label: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, Icon: FaFacebook },
    { label: 'X', href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`, Icon: Share2 },
  ];

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-ink/50">Share:</span>
      {links.map(({ label, href, Icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Share on ${label}`}
          title={`Share on ${label}`}
          className="rounded-full border border-border p-2 text-ink/60 hover:border-primary hover:text-primary"
        >
          <Icon size={16} />
        </a>
      ))}
    </div>
  );
}