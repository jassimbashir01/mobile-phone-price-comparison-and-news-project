"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  updateExchangeRate,
  updateSocialLinks,
  updateMediaKitStats,
  updateHomepageBanner,
  updateSidebarBanner,
} from "@/lib/actions/settings";
import { SingleImageUploader } from "@/components/admin/SingleImageUploader";
import type {
  SocialLink,
  MediaKitStats,
  HomepageBannerSetting,
  Brand,
  SidebarBannerSetting,
} from "@/types/database";

const PLATFORM_LABELS: Record<SocialLink["platform"], string> = {
  facebook: "Facebook",
  instagram: "Instagram",
  twitter: "X (Twitter)",
  youtube: "YouTube",
  tiktok: "TikTok",
  whatsapp: "WhatsApp",
};

export function SettingsForm({
  initialRate,
  initialSocialLinks,
  initialMediaKitStats,
  initialHomepageBanner,
  initialSidebarBanner,
}: {
  initialRate: number;
  initialSocialLinks: SocialLink[];
  initialMediaKitStats: MediaKitStats;
  initialHomepageBanner: HomepageBannerSetting;
  initialSidebarBanner: SidebarBannerSetting;
}) {
  const router = useRouter();

  const [rate, setRate] = useState(String(initialRate));
  const [rateSaving, setRateSaving] = useState(false);
  const [rateSaved, setRateSaved] = useState(false);
  const [rateError, setRateError] = useState("");

  async function handleSaveRate(e: React.FormEvent) {
    e.preventDefault();
    setRateError("");
    setRateSaving(true);
    try {
      await updateExchangeRate(Number(rate));
      setRateSaved(true);
      router.refresh();
      setTimeout(() => setRateSaved(false), 2000);
    } catch (err) {
      setRateError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setRateSaving(false);
    }
  }

  const [links, setLinks] = useState<SocialLink[]>(initialSocialLinks);
  const [linksSaving, setLinksSaving] = useState(false);
  const [linksSaved, setLinksSaved] = useState(false);
  const [linksError, setLinksError] = useState("");

  function updateLink(
    platform: SocialLink["platform"],
    field: "url" | "enabled",
    value: string | boolean,
  ) {
    setLinks((prev) =>
      prev.map((l) => (l.platform === platform ? { ...l, [field]: value } : l)),
    );
    setLinksSaved(false);
  }

  async function handleSaveLinks() {
    setLinksError("");
    setLinksSaving(true);
    try {
      await updateSocialLinks(links);
      setLinksSaved(true);
      router.refresh();
      setTimeout(() => setLinksSaved(false), 2000);
    } catch (err) {
      setLinksError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setLinksSaving(false);
    }
  }

  const [stats, setStats] = useState<MediaKitStats>(initialMediaKitStats);
  const [statsSaving, setStatsSaving] = useState(false);
  const [statsSaved, setStatsSaved] = useState(false);
  const [statsError, setStatsError] = useState("");

  function updateStat(field: keyof MediaKitStats, value: string) {
    setStats((prev) => ({ ...prev, [field]: value }));
    setStatsSaved(false);
  }

  async function handleSaveStats() {
    setStatsError("");
    setStatsSaving(true);
    try {
      await updateMediaKitStats(stats);
      setStatsSaved(true);
      router.refresh();
      setTimeout(() => setStatsSaved(false), 2000);
    } catch (err) {
      setStatsError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setStatsSaving(false);
    }
  }

  const [banner, setBanner] = useState<HomepageBannerSetting>(
    initialHomepageBanner,
  );
  const [bannerSaving, setBannerSaving] = useState(false);
  const [bannerSaved, setBannerSaved] = useState(false);
  const [bannerError, setBannerError] = useState("");

  async function handleSaveBanner() {
    setBannerError("");
    setBannerSaving(true);
    try {
      await updateHomepageBanner(banner);
      setBannerSaved(true);
      router.refresh();
      setTimeout(() => setBannerSaved(false), 2000);
    } catch (err) {
      setBannerError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setBannerSaving(false);
    }
  }

  const [sidebarBanner, setSidebarBanner] =
    useState<SidebarBannerSetting>(initialSidebarBanner);
  const [sidebarBannerSaving, setSidebarBannerSaving] = useState(false);
  const [sidebarBannerSaved, setSidebarBannerSaved] = useState(false);
  const [sidebarBannerError, setSidebarBannerError] = useState("");

  async function handleSaveSidebarBanner() {
    setSidebarBannerError("");
    setSidebarBannerSaving(true);
    try {
      await updateSidebarBanner(sidebarBanner);
      setSidebarBannerSaved(true);
      router.refresh();
      setTimeout(() => setSidebarBannerSaved(false), 2000);
    } catch (err) {
      setSidebarBannerError(
        err instanceof Error ? err.message : "Failed to save",
      );
    } finally {
      setSidebarBannerSaving(false);
    }
  }

  return (
    <div className="max-w-2xl space-y-8">
      <section className="rounded-lg border border-border bg-white p-4">
        <h2 className="mb-1 text-sm font-bold">USD Exchange Rate</h2>
        <p className="mb-3 text-xs text-ink/50">
          PKR ÷ this number = the USD price shown on every phone page.
        </p>
        <form onSubmit={handleSaveRate} className="flex items-end gap-3">
          <div>
            <label htmlFor="rate" className="mb-1 block text-xs font-medium">
              1 USD = ? PKR
            </label>
            <input
              id="rate"
              type="number"
              step="0.01"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              className="w-32 rounded-md border border-border px-3 py-2 text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={rateSaving}
            className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-50"
          >
            {rateSaving ? "Saving…" : rateSaved ? "Saved ✓" : "Save Rate"}
          </button>
        </form>
        {rateError && <p className="mt-2 text-xs text-red-600">{rateError}</p>}
        <p className="mt-2 text-[11px] text-ink/40">
          ⚠️ Already-cached phone pages take up to 24 hours to reflect a rate
          change.
        </p>
      </section>

      <section className="rounded-lg border border-border bg-white p-4">
        <h2 className="mb-1 text-sm font-bold">Social Media Links</h2>
        <p className="mb-3 text-xs text-ink/50">
          Shown on every phone page. Only enabled platforms with a URL appear
          publicly.
        </p>
        <div className="space-y-3">
          {links.map((link) => (
            <div key={link.platform} className="flex items-center gap-3">
              <label className="flex w-32 shrink-0 items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={link.enabled}
                  onChange={(e) =>
                    updateLink(link.platform, "enabled", e.target.checked)
                  }
                />
                {PLATFORM_LABELS[link.platform]}
              </label>
              <input
                type="url"
                placeholder="https://..."
                value={link.url}
                onChange={(e) =>
                  updateLink(link.platform, "url", e.target.value)
                }
                className="flex-1 rounded-md border border-border px-3 py-2 text-sm"
              />
            </div>
          ))}
        </div>
        <button
          onClick={handleSaveLinks}
          disabled={linksSaving}
          className="mt-4 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-50"
        >
          {linksSaving
            ? "Saving…"
            : linksSaved
              ? "Saved ✓"
              : "Save Social Links"}
        </button>
        {linksError && (
          <p className="mt-2 text-xs text-red-600">{linksError}</p>
        )}
      </section>

      <section className="rounded-lg border border-border bg-white p-4">
        <h2 className="mb-1 text-sm font-bold">Media Kit Stats</h2>
        <p className="mb-3 text-xs text-ink/50">
          Shown on the public /media-kit page. Pull real numbers from your
          analytics once you have meaningful traffic.
        </p>
        <div className="space-y-3">
          <div>
            <label
              htmlFor="monthly_visitors"
              className="mb-1 block text-xs font-medium"
            >
              Monthly Visitors
            </label>
            <input
              id="monthly_visitors"
              value={stats.monthly_visitors}
              onChange={(e) => updateStat("monthly_visitors", e.target.value)}
              className="w-full rounded-md border border-border px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="monthly_pageviews"
              className="mb-1 block text-xs font-medium"
            >
              Monthly Pageviews
            </label>
            <input
              id="monthly_pageviews"
              value={stats.monthly_pageviews}
              onChange={(e) => updateStat("monthly_pageviews", e.target.value)}
              className="w-full rounded-md border border-border px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="avg_session_duration"
              className="mb-1 block text-xs font-medium"
            >
              Average Session Duration
            </label>
            <input
              id="avg_session_duration"
              value={stats.avg_session_duration}
              onChange={(e) =>
                updateStat("avg_session_duration", e.target.value)
              }
              className="w-full rounded-md border border-border px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="top_regions"
              className="mb-1 block text-xs font-medium"
            >
              Top Regions
            </label>
            <input
              id="top_regions"
              value={stats.top_regions}
              onChange={(e) => updateStat("top_regions", e.target.value)}
              className="w-full rounded-md border border-border px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="audience_description"
              className="mb-1 block text-xs font-medium"
            >
              Audience Description
            </label>
            <textarea
              id="audience_description"
              rows={3}
              value={stats.audience_description}
              onChange={(e) =>
                updateStat("audience_description", e.target.value)
              }
              className="w-full rounded-md border border-border px-3 py-2 text-sm"
            />
          </div>
        </div>
        <button
          onClick={handleSaveStats}
          disabled={statsSaving}
          className="mt-4 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-50"
        >
          {statsSaving
            ? "Saving…"
            : statsSaved
              ? "Saved ✓"
              : "Save Media Kit Stats"}
        </button>
        {statsError && (
          <p className="mt-2 text-xs text-red-600">{statsError}</p>
        )}
      </section>

      <section className="rounded-lg border border-border bg-white p-4">
        <h2 className="mb-1 text-sm font-bold">
          Homepage Banner (sold placement)
        </h2>
        <p className="mb-3 text-xs text-ink/50">
          Upload a creative, set the destination link, and enable it once a
          client has paid for the slot.
        </p>
        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-xs font-medium">
              Banner Image
            </label>
            <SingleImageUploader
              value={banner.cloudinary_public_id || null}
              onChange={(id) =>
                setBanner((prev) => ({
                  ...prev,
                  cloudinary_public_id: id ?? "",
                }))
              }
            />
          </div>
          <div>
            <label
              htmlFor="link_url"
              className="mb-1 block text-xs font-medium"
            >
              Destination URL
            </label>
            <input
              id="link_url"
              type="url"
              value={banner.link_url}
              onChange={(e) =>
                setBanner((prev) => ({ ...prev, link_url: e.target.value }))
              }
              className="w-full rounded-md border border-border px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="alt_text"
              className="mb-1 block text-xs font-medium"
            >
              Alt Text
            </label>
            <input
              id="alt_text"
              value={banner.alt_text}
              onChange={(e) =>
                setBanner((prev) => ({ ...prev, alt_text: e.target.value }))
              }
              className="w-full rounded-md border border-border px-3 py-2 text-sm"
            />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={banner.enabled}
              onChange={(e) =>
                setBanner((prev) => ({ ...prev, enabled: e.target.checked }))
              }
            />
            Enabled (visible on the homepage)
          </label>
        </div>
        <button
          onClick={handleSaveBanner}
          disabled={bannerSaving}
          className="mt-4 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-50"
        >
          {bannerSaving
            ? "Saving…"
            : bannerSaved
              ? "Saved ✓"
              : "Save Homepage Banner"}
        </button>
        {bannerError && (
          <p className="mt-2 text-xs text-red-600">{bannerError}</p>
        )}
      </section>

      <section className="rounded-lg border border-border bg-white p-4">
        <h2 className="mb-1 text-sm font-bold">
          Sidebar Banner (sold placement)
        </h2>
        <div className="space-y-3">
          <SingleImageUploader
            value={sidebarBanner.cloudinary_public_id || null}
            onChange={(id) =>
              setSidebarBanner((prev) => ({
                ...prev,
                cloudinary_public_id: id ?? "",
              }))
            }
          />
          <input
            type="url"
            placeholder="Destination URL"
            value={sidebarBanner.link_url}
            onChange={(e) =>
              setSidebarBanner((prev) => ({
                ...prev,
                link_url: e.target.value,
              }))
            }
            className="w-full rounded-md border border-border px-3 py-2 text-sm"
          />
          <input
            placeholder="Alt text"
            value={sidebarBanner.alt_text}
            onChange={(e) =>
              setSidebarBanner((prev) => ({
                ...prev,
                alt_text: e.target.value,
              }))
            }
            className="w-full rounded-md border border-border px-3 py-2 text-sm"
          />
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={sidebarBanner.enabled}
              onChange={(e) =>
                setSidebarBanner((prev) => ({
                  ...prev,
                  enabled: e.target.checked,
                }))
              }
            />
            Enabled
          </label>
        </div>
        <button
          onClick={handleSaveSidebarBanner}
          disabled={sidebarBannerSaving}
          className="mt-4 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-50"
        >
          {sidebarBannerSaving
            ? "Saving…"
            : sidebarBannerSaved
              ? "Saved ✓"
              : "Save Sidebar Banner"}
        </button>
        {sidebarBannerError && (
          <p className="mt-2 text-xs text-red-600">{sidebarBannerError}</p>
        )}
      </section>
    </div>
  );
}
