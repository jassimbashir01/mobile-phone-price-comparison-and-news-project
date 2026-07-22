"use client";

import { useState } from "react";
import { siWhatsapp, siFacebook, siX } from "simple-icons";
import { Share2, Check, X } from "lucide-react";
import { SimpleIcon } from "@/components/ui/SimpleIcon";

export function ShareButtons({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const links = [
    {
      label: "WhatsApp",
      href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      icon: siWhatsapp,
    },
    {
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      icon: siFacebook,
    },
    {
      label: "X",
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      icon: siX,
    },
  ];

  async function handleNativeShare() {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // User cancelled the native share sheet — not an error.
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Give the user a real signal instead of silence — they still have
      // a way forward (manually copy the URL bar) but at least know the
      // one-click copy didn't work.
      setCopyFailed(true);
      setTimeout(() => setCopyFailed(false), 3000);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-ink/50">Share:</span>
      {links.map(({ label, href, icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Share on ${label}`}
          title={`Share on ${label}`}
          className="rounded-full border border-border p-2 text-ink/60 hover:border-primary hover:text-primary"
        >
          <SimpleIcon path={icon.path} />
        </a>
      ))}
      <button
        onClick={handleNativeShare}
        aria-label={
          copied
            ? "Link copied"
            : copyFailed
              ? "Copy failed"
              : "Share or copy link"
        }
        title={
          copied
            ? "Link copied!"
            : copyFailed
              ? "Couldn't copy — copy the URL manually"
              : "Share or copy link"
        }
        className="rounded-full border border-border p-2 text-ink/60 hover:border-primary hover:text-primary"
      >
        {copied ? (
          <Check size={16} />
        ) : copyFailed ? (
          <X size={16} />
        ) : (
          <Share2 size={16} />
        )}
      </button>
    </div>
  );
}
