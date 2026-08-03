/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import { X, Share, Plus } from "lucide-react";

const DISMISSED_AT_KEY = "mw-install-dismissed-at";
const RE_PROMPT_AFTER_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

function shouldShowAgain(): boolean {
  const raw = localStorage.getItem(DISMISSED_AT_KEY);
  if (!raw) return true;
  const dismissedAt = Number(raw);
  if (!Number.isFinite(dismissedAt)) return true;
  return Date.now() - dismissedAt > RE_PROMPT_AFTER_MS;
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showIosHint, setShowIosHint] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Already installed — never show, on any platform.
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone ===
        true;
    if (isStandalone) return;

    if (!shouldShowAgain()) return;

    const isIos = /iphone|ipad|ipod/i.test(window.navigator.userAgent);

    if (isIos) {
      // iOS Safari has no programmatic install — show the manual steps.
      setShowIosHint(true);
      setVisible(true);
      return;
    }

    function handler(e: Event) {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setVisible(true);
    }
    window.addEventListener("beforeinstallprompt", handler);

    // If the user installs via the browser's own menu, stop prompting.
    function installed() {
      localStorage.setItem(DISMISSED_AT_KEY, String(Date.now()));
      setVisible(false);
    }
    window.addEventListener("appinstalled", installed);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("appinstalled", installed);
    };
  }, []);

  function dismiss() {
    localStorage.setItem(DISMISSED_AT_KEY, String(Date.now()));
    setVisible(false);
  }

  async function install() {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    localStorage.setItem(DISMISSED_AT_KEY, String(Date.now()));
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-3 bottom-3 z-50 rounded-lg border border-border bg-white p-4 shadow-lg sm:left-auto sm:right-4 sm:w-80">
      <button
        onClick={dismiss}
        aria-label="Dismiss install prompt"
        className="absolute right-2 top-2 text-ink/40 hover:text-ink"
      >
        <X size={16} />
      </button>

      <p className="mb-1 pr-6 text-sm font-bold">Install MobileWala</p>

      {showIosHint ? (
        <>
          <p className="mb-2 text-xs leading-relaxed text-ink/60">
            Tap <Share size={12} className="inline" /> below, then{" "}
            <Plus size={12} className="inline" />{" "}
            <strong>Add to Home Screen</strong>.
          </p>
          <button
            onClick={dismiss}
            className="w-full rounded-md border border-border px-4 py-2 text-xs font-semibold text-ink/60 hover:border-primary"
          >
            Got it
          </button>
        </>
      ) : (
        <>
          <p className="mb-3 text-xs text-ink/60">
            Add it to your home screen for faster access and offline browsing.
          </p>
          <button
            onClick={install}
            className="w-full rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark"
          >
            Install App
          </button>
        </>
      )}
    </div>
  );
}
