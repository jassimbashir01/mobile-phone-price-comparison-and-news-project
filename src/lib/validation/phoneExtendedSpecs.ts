import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { chromium } from "playwright";
import { createClient } from "@supabase/supabase-js";
import OpenAI from "openai";
import fs from "fs";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!,
);
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const AI_MODEL = "gpt-4o-mini";

const APPLY = process.argv.includes("--apply");
const DEBUG = process.argv.includes("--debug");
const FORMAT_ONLY = process.argv.includes("--format-only");
const slugArg = process.argv.find((a) => a.startsWith("--slug="));
const ONLY_SLUG = slugArg ? slugArg.split("=")[1] : null;

console.log("═".repeat(64));
console.log("  MobileWala — Spec Sync & Format");
console.log("═".repeat(64));
console.log(
  APPLY
    ? "⚠️  APPLY MODE — changes WILL be written"
    : "🔍 DRY RUN — nothing written (add --apply to commit)",
);
if (FORMAT_ONLY) console.log("ℹ️  FORMAT-ONLY — no network, no AI, no cost.");
console.log(
  "ℹ️  Order per phone: search → compare/correct/fill/clear → FORMAT (always)",
);
console.log("ℹ️  Only scraped data is written. Nothing is invented.");
console.log("═".repeat(64) + "\n");

// ── Schema ────────────────────────────────────────────────────────────────

const EXTENDED_SPEC_COLUMNS = {
  Build: [
    "build_os",
    "build_ui",
    "build_dimensions",
    "build_weight",
    "build_sim",
    "build_colors",
    "build_extra",
  ],
  Frequency: ["freq_2g", "freq_3g", "freq_4g", "freq_5g", "freq_extra"],
  Processor: ["proc_cpu", "proc_chipset", "proc_gpu", "proc_extra"],
  Display: [
    "display_technology",
    "display_size",
    "display_resolution",
    "display_protection",
    "display_extra_features",
  ],
  Memory: ["memory_built_in", "memory_card", "memory_extra"],
  Camera: ["camera_main", "camera_features", "camera_front", "camera_extra"],
  Connectivity: [
    "conn_wlan",
    "conn_bluetooth",
    "conn_gps",
    "conn_radio",
    "conn_usb",
    "conn_nfc",
    "conn_infrared",
    "conn_data",
    "conn_extra",
  ],
  Features: [
    "feat_sensors",
    "feat_audio",
    "feat_browser",
    "feat_messaging",
    "feat_games",
    "feat_torch",
    "feat_extra",
  ],
  Battery: ["battery_charging", "battery_extra"],
};
const ALL_EXTENDED_COLUMNS = Object.values(EXTENDED_SPEC_COLUMNS).flat();

const BOOLEAN_FIELDS = [
  "bluetooth",
  "wifi",
  "dual_sim",
  "fm_radio",
  "memory_card",
  "mp3",
  "video_recording",
  "has_camera",
] as const;
const FILTERING_SCALARS = [
  "network_type",
  "os",
  "ram_gb",
  "storage_gb",
  "display_size",
  "main_camera_mp",
  "battery_mah",
  "processor",
  "display_type",
] as const;
const FILTERING_TEXT_FIELDS = new Set<string>([
  "os",
  "processor",
  "display_type",
  "network_type",
]);

// ── Formatting ────────────────────────────────────────────────────────────

const CANONICAL_TERMS: Record<string, string> = {
  amoled: "AMOLED",
  "super amoled": "Super AMOLED",
  "super amoled plus": "Super AMOLED Plus",
  "dynamic amoled": "Dynamic AMOLED",
  "ltpo amoled": "LTPO AMOLED",
  ltpo: "LTPO",
  oled: "OLED",
  "p-oled": "P-OLED",
  "ips lcd": "IPS LCD",
  ips: "IPS",
  lcd: "LCD",
  tft: "TFT",
  "tft lcd": "TFT LCD",
  pls: "PLS",
  "pls lcd": "PLS LCD",
  retina: "Retina",
  lte: "LTE",
  "lte-a": "LTE-A",
  gsm: "GSM",
  hspa: "HSPA",
  umts: "UMTS",
  cdma: "CDMA",
  wcdma: "WCDMA",
  edge: "EDGE",
  gprs: "GPRS",
  volte: "VoLTE",
  vowifi: "VoWiFi",
  "wi-fi": "Wi-Fi",
  wifi: "Wi-Fi",
  wlan: "WLAN",
  nfc: "NFC",
  gps: "GPS",
  aptx: "aptX",
  "aptx hd": "aptX HD",
  "a-gps": "A-GPS",
  glonass: "GLONASS",
  bds: "BDS",
  galileo: "Galileo",
  qzss: "QZSS",
  usb: "USB",
  "usb type-c": "USB Type-C",
  "type-c": "Type-C",
  otg: "OTG",
  "micro-usb": "Micro-USB",
  microusb: "Micro-USB",
  hdmi: "HDMI",
  ir: "IR",
  "ir blaster": "IR Blaster",
  fm: "FM",
  "fm radio": "FM Radio",
  sms: "SMS",
  mms: "MMS",
  "e-mail": "E-mail",
  email: "E-mail",
  im: "IM",
  html: "HTML",
  html5: "HTML5",
  mp3: "MP3",
  mp4: "MP4",
  wav: "WAV",
  aac: "AAC",
  flac: "FLAC",
  eis: "EIS",
  ois: "OIS",
  hdr: "HDR",
  pdaf: "PDAF",
  led: "LED",
  "dual-led": "Dual-LED",
  "quad-led": "Quad-LED",
  af: "AF",
  fhd: "FHD",
  "fhd+": "FHD+",
  hd: "HD",
  "hd+": "HD+",
  qhd: "QHD",
  "qhd+": "QHD+",
  uhd: "UHD",
  "4k": "4K",
  "8k": "8K",
  "1080p": "1080p",
  "720p": "720p",
  ram: "RAM",
  rom: "ROM",
  emmc: "eMMC",
  ufs: "UFS",
  sd: "SD",
  microsd: "microSD",
  microsdxc: "microSDXC",
  microsdhc: "microSDHC",
  sim: "SIM",
  "dual sim": "Dual SIM",
  "nano-sim": "Nano-SIM",
  esim: "eSIM",
  gpu: "GPU",
  cpu: "CPU",
  soc: "SoC",
  nm: "nm",
  ghz: "GHz",
  mhz: "MHz",
  mah: "mAh",
  mp: "MP",
  gb: "GB",
  mb: "MB",
  tb: "TB",
  kb: "KB",
  ppi: "PPI",
  hz: "Hz",
  nits: "nits",
  ip68: "IP68",
  ip67: "IP67",
  ip54: "IP54",
  "gorilla glass": "Gorilla Glass",
  corning: "Corning",
  android: "Android",
  ios: "iOS",
  ipados: "iPadOS",
  "one ui": "One UI",
  miui: "MIUI",
  hyperos: "HyperOS",
  coloros: "ColorOS",
  funtouch: "Funtouch",
  "usb-c": "USB-C",
  "3.5mm": "3.5mm",
  yes: "Yes",
  no: "No",
  "2g": "2G",
  "3g": "3G",
  "4g": "4G",
  "5g": "5G",
};

/**
 * Cleans a spec value:
 *  - strips a leading dash
 *  - inserts a space before "(" when glued: SMS(threaded view) → SMS (threaded view)
 *  - applies canonical casing to known terms (amoled → AMOLED)
 *  - title-cases ONLY fully-lowercase words, so acronyms and mixed-case
 *    values survive: SMS, mAh, iOS, T606 unchanged; "threaded view" → "Threaded View"
 *  - capitalizes both halves of a hyphenated word: built-in → Built-In
 */
function formatSpecValue(raw: string): string {
  let v = raw.replace(/^\s*[-–—]\s*/, "").trim();
  if (!v) return "";

  v = v.replace(/(\S)\(/g, "$1 (").replace(/\s+/g, " ");

  const multiWord = Object.keys(CANONICAL_TERMS)
    .filter((k) => k.includes(" "))
    .sort((a, b) => b.length - a.length);
  for (const term of multiWord) {
    const re = new RegExp(
      `\\b${term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`,
      "gi",
    );
    v = v.replace(re, CANONICAL_TERMS[term]);
  }

  function capWord(word: string): string {
    if (!word) return word;
    const canonical = CANONICAL_TERMS[word.toLowerCase()];
    if (canonical) return canonical;
    if (/[A-Z]/.test(word)) return word;
    if (!/[a-z]/.test(word)) return word;
    return word.charAt(0).toUpperCase() + word.slice(1);
  }

  return v
    .split(" ")
    .map((token) => {
      const lead = token.match(/^[^A-Za-z0-9]*/)?.[0] ?? "";
      const trail = token.match(/[^A-Za-z0-9]*$/)?.[0] ?? "";
      const core = token.slice(lead.length, token.length - trail.length);
      if (!core) return token;
      return lead + core.split("-").map(capWord).join("-") + trail;
    })
    .join(" ");
}

// ── Site search ───────────────────────────────────────────────────────────

function normalizeForCompare(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Uses whatmobile's own search rather than constructing a URL. Results use
 * the same td.BiggerText structure as the brand listing pages: the second
 * anchor holds the display name across a <br>, e.g. "Sparx<br>S6".
 */
async function findPhoneUrlViaSearch(
  page: import("playwright").Page,
  phoneName: string,
): Promise<{ url: string; matchedName: string } | null> {
  const searchUrl = `https://www.whatmobile.com.pk/search.php?q=${encodeURIComponent(phoneName)}`;
  await page
    .goto(searchUrl, { waitUntil: "domcontentloaded" })
    .catch(() => null);

  const results = await page
    .$$eval("td.BiggerText", (cells) => {
      const out: { url: string; name: string }[] = [];
      for (const cell of cells) {
        const links = Array.from(
          cell.querySelectorAll('a[href^="/"]'),
        ) as HTMLAnchorElement[];
        if (links.length === 0) continue;
        const textLink =
          links.find((l) => (l.innerText || "").trim().length > 0) ?? links[0];
        const name = (textLink.innerText || "").replace(/\s+/g, " ").trim();
        if (name) out.push({ url: textLink.href, name });
      }
      return out;
    })
    .catch(() => []);

  if (results.length === 0) return null;

  const target = normalizeForCompare(phoneName);
  const targetWords = target.split(" ").filter(Boolean);
  if (targetWords.length === 0) return null;

  const exact = results.find((r) => normalizeForCompare(r.name) === target);
  if (exact) return { url: exact.url, matchedName: exact.name };

  // Word-overlap score with a length penalty, so "S6" doesn't match "S6 Pro"
  const scored = results
    .map((r) => {
      const rWords = normalizeForCompare(r.name).split(" ").filter(Boolean);
      const overlap = rWords.filter((w) => targetWords.includes(w)).length;
      const penalty = Math.abs(rWords.length - targetWords.length);
      return { ...r, score: overlap - penalty };
    })
    .sort((a, b) => b.score - a.score);

  const best = scored[0];
  // Require every target word to be present — a partial match is a wrong match
  if (!best || best.score < targetWords.length) return null;
  return { url: best.url, matchedName: best.name };
}

// ── Phone page scraping ───────────────────────────────────────────────────

async function scrapePhonePage(page: import("playwright").Page, url: string) {
  await page.goto(url, { waitUntil: "domcontentloaded" }).catch(() => null);

  const name = await page
    .$eval("h1.hdng3", (el) => el.textContent?.trim() ?? "")
    .catch(() => "");
  // Class-only selector — priced phones use <div class="hdng">, coming-soon
  // phones use <span class="hdng">.
  const priceRaw = await page
    .$eval(".hdng", (el) => (el as HTMLElement).innerText)
    .catch(() => "");

  // 3-column table: [group?, label, value]. The group cell only appears on
  // the first row of each group (rowspan). The VALUE is always the LAST cell.
  const specRows = await page
    .$$eval("table.specs tr", (rows) => {
      const out: { group: string; label: string; value: string }[] = [];
      let currentGroup = "";
      for (const row of rows) {
        const cells = Array.from(
          row.querySelectorAll("td, th"),
        ) as HTMLElement[];
        const texts = cells.map((c) =>
          (c.innerText || c.textContent || "").replace(/\s+/g, " ").trim(),
        );
        if (texts.length === 0) continue;
        if (texts.length >= 3) {
          currentGroup = texts[0] || currentGroup;
          out.push({
            group: currentGroup,
            label: texts[1],
            value: texts[texts.length - 1],
          });
        } else if (texts.length === 2) {
          out.push({ group: currentGroup, label: texts[0], value: texts[1] });
        }
      }
      return out.filter((r) => r.label || r.value);
    })
    .catch(() => []);

  // Three confirmed cases:
  //   "Rs. 28,999 / USD $89"                  → available
  //   "Rs. Coming Soon / Expected Rs. 64,999" → coming soon + expected price
  //   "Rs. Coming Soon / USD $NA"             → coming soon, no prices
  const hasComingSoonTag = /coming\s*soon/i.test(priceRaw);
  const expectedMatch = priceRaw.match(/Expected\s*Rs\.?\s*([\d,]+)/i);
  // Requires digits right after "Rs." — cannot match "Rs. Coming Soon"
  const realPriceMatch = priceRaw.match(/Rs\.?\s*([\d,]+)/i);

  let status: "available" | "coming_soon";
  let price_pkr: number | null = null;
  let expected_price_pkr: number | null = null;

  if (hasComingSoonTag) {
    status = "coming_soon";
    if (expectedMatch)
      expected_price_pkr = parseInt(expectedMatch[1].replace(/,/g, ""));
  } else if (realPriceMatch) {
    status = "available";
    price_pkr = parseInt(realPriceMatch[1].replace(/,/g, ""));
  } else {
    status = "coming_soon";
  }

  return {
    name,
    specRows,
    isValid: Boolean(name) && specRows.length > 0,
    status,
    price_pkr,
    expected_price_pkr,
    priceRaw,
  };
}

// ── AI mapping — two separate calls so filtering and extended can't mix ──

type SpecRow = { group: string; label: string; value: string };

async function mapExtendedSpecs(name: string, specRows: SpecRow[]) {
  const schemaDescription = Object.entries(EXTENDED_SPEC_COLUMNS)
    .map(([g, c]) => `${g}: ${c.join(", ")}`)
    .join("\n");
  const rowsText = specRows
    .map(
      (r, i) =>
        `[${i}] GROUP="${r.group}" LABEL="${r.label}" VALUE="${r.value}"`,
    )
    .join("\n");

  const prompt = `Map these scraped mobile phone spec rows into a database schema.
Phone: "${name}"

Rows, in exact page order:
${rowsText}

ABSOLUTE RULES:
- Use ONLY the VALUEs above. Never add information not present in them.
- If no row matches a column, that column MUST be null. Do not guess,
  infer, or fill from your own knowledge of this phone.
- Copy each VALUE completely — never shorten, summarize, or truncate.
  Long values (full band lists, sensor lists) must be included in full.

Return JSON with exactly these keys:
{
  ${ALL_EXTENDED_COLUMNS.map((c) => `"${c}": string or null`).join(",\n  ")}
}

Column groups: ${schemaDescription}

BATTERY: there are TWO rows labelled "Capacity" in the Battery group.
Using the [index] order above:
- the FIRST Capacity row's VALUE → "battery_charging"
- the SECOND Capacity row's VALUE → "battery_extra"

If a row fits no named column in its group, put its full VALUE in that
group's "_extra" column (join multiple with semicolons).

Return ONLY the JSON object, no markdown fences.`;

  const res = await openai.chat.completions.create({
    model: AI_MODEL,
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
    max_tokens: 3000,
  });
  return JSON.parse(
    (res.choices[0].message.content ?? "{}")
      .replace(/```json\n?|\n?```/g, "")
      .trim(),
  );
}

async function mapFilteringSpecs(name: string, specRows: SpecRow[]) {
  const rowsText = specRows
    .map((r) => `${r.group} | ${r.label}: ${r.value}`)
    .join("\n");

  const prompt = `Extract normalized filtering values from these scraped mobile
phone spec rows. Phone: "${name}"

Rows:
${rowsText}

ABSOLUTE RULES:
- Derive values ONLY from the rows above. If the rows don't contain the
  information, return null. Never fill from your own knowledge of this
  phone — a wrong value is far worse than a null.
- Booleans: base them strictly on whether a relevant row exists.

Return JSON:
{
  "network_type": "2G"|"3G"|"4G"|"5G"|null,
  "os": string|null,
  "ram_gb": number|null,
  "storage_gb": number|null,
  "display_size": number|null,
  "main_camera_mp": number|null,
  "battery_mah": number|null,
  "processor": string|null,
  "display_type": string|null,
  "bluetooth": bool, "wifi": bool, "dual_sim": bool, "fm_radio": bool,
  "memory_card": bool, "mp3": bool, "video_recording": bool, "has_camera": bool
}

EXTRACTION RULES:
- network_type: the HIGHEST generation that has an actual band value in
  the rows (5G > 4G > 3G > 2G). If only 2G bands are listed, "2G".
- os: the OS family only — "Android", "iOS", "Windows", "Feature Phone".
  Not the version number.
- ram_gb: the LOWEST physical RAM figure if several are listed. Ignore
  extended/virtual/expandable RAM entirely. Number only.
- storage_gb: the LOWEST built-in storage option listed. Number only.
- display_size: inches, ONE decimal place (6.7).
- display_type: the official panel technology ONLY, exactly as the rows
  state it — e.g. "AMOLED", "Super AMOLED", "IPS LCD", "LTPO AMOLED",
  "OLED", "TFT". Strip resolution, refresh rate, brightness, touchscreen
  wording and all marketing text. If the rows only say something generic
  like "Capacitive Touchscreen" with no panel type, return null.
- processor: the chipset's official model name as stated in the rows —
  e.g. "Snapdragon 8 Elite", "Snapdragon 8 Gen 3", "Dimensity 7300",
  "Helio G99", "Exynos 2400", "T606", "A17 Pro". Strip the manufacturer
  prefix (Qualcomm, MediaTek, Samsung, Apple, Unisoc). Strip fabrication
  process ("4 nm"), core counts and clock speeds. If the rows give only a
  generic description with no model name, return null.
- main_camera_mp: the REAR main camera megapixels, never the front. If
  several rear lenses are listed, use the primary (highest) one. Number only.
- battery_mah: capacity number only (5000).
- mp3: true.
- wifi / bluetooth: true if a WLAN/Wi-Fi or Bluetooth row has any value.
- dual_sim: true if the SIM row indicates two SIMs — "Dual", "Nano + Nano",
  "Nano + eSIM", or two separate SIM entries.
- fm_radio: true if a Radio row exists at all, even if "Unspecified".
- has_camera: true if any camera row has a value.
- video_recording: true if a camera exists or a video row has a value.
- memory_card: true unless the row says "No" / "None" / is empty.

Return ONLY the JSON object, no markdown fences.`;

  const res = await openai.chat.completions.create({
    model: AI_MODEL,
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
    max_tokens: 800,
  });
  return JSON.parse(
    (res.choices[0].message.content ?? "{}")
      .replace(/```json\n?|\n?```/g, "")
      .trim(),
  );
}

// ── Logging ───────────────────────────────────────────────────────────────

function logChange(
  action: string,
  field: string,
  before: unknown,
  after: unknown,
) {
  const icon =
    action === "FILL"
      ? "➕ FILL"
      : action === "CORRECT"
        ? "✏️  CORRECT"
        : action === "FORMAT"
          ? "🎨 FORMAT"
          : "🗑️  CLEAR";
  console.log(`   ${icon}  ${field}`);
  console.log(
    `      before: ${before === null || before === undefined || before === "" ? "(empty)" : before}`,
  );
  console.log(
    `      after:  ${after === "" || after === null ? "(empty)" : after}`,
  );
}

interface PhoneRow {
  id: string;
  name: string;
  slug: string;
  brand_id: string;
  status: string;
  price_pkr: number | null;
  expected_price_pkr: number | null;
}

const notFound: { name: string; slug: string; reason: string }[] = [];
const stats = {
  matched: 0,
  formatChanges: 0,
  syncChanges: 0,
  unchanged: 0,
  phonesFormatted: 0,
};

async function processPhone(
  page: import("playwright").Page | null,
  phone: PhoneRow,
) {
  const { data: currentFiltering } = await supabase
    .from("phone_specs")
    .select("*")
    .eq("phone_id", phone.id)
    .maybeSingle();
  const { data: currentExtended } = await supabase
    .from("phone_extended_specs")
    .select("*")
    .eq("phone_id", phone.id)
    .maybeSingle();

  const phoneUpdate: Record<string, unknown> = {};
  const filteringUpdate: Record<string, unknown> = {};
  const extendedUpdate: Record<string, string> = {};
  let matched = false;

  // Header prints unconditionally, so every phone appears in the log.
  console.log(`\n→ ${phone.name}`);

  // ═══ STEP 1: SEARCH → COMPARE → CORRECT / FILL / CLEAR ════════════════
  if (!FORMAT_ONLY && page) {
    const found = await findPhoneUrlViaSearch(page, phone.name);

    if (!found) {
      console.log(`   ⏭️  not found on whatmobile — specs not verified`);
      notFound.push({
        name: phone.name,
        slug: phone.slug,
        reason: "no search match",
      });
    } else {
      const scraped = await scrapePhonePage(page, found.url);
      if (!scraped.isValid) {
        console.log(
          `   ⏭️  matched "${found.matchedName}" but that page has no spec table`,
        );
        notFound.push({
          name: phone.name,
          slug: phone.slug,
          reason: `matched "${found.matchedName}" but no spec table`,
        });
      } else {
        matched = true;
        stats.matched++;
        console.log(
          `   🔎 matched: "${found.matchedName}" → ${found.url} (${scraped.specRows.length} rows)`,
        );
        console.log(
          `   💰 price: "${scraped.priceRaw.replace(/\n/g, " | ")}" → ${scraped.status}`,
        );

        if (DEBUG) {
          console.log("   --- RAW ROWS ---");
          scraped.specRows.forEach((r, i) =>
            console.log(`   [${i}] ${r.group} | ${r.label} | ${r.value}`),
          );
          console.log("   --- END ---");
        }

        const [extended, filtering] = await Promise.all([
          mapExtendedSpecs(scraped.name, scraped.specRows),
          mapFilteringSpecs(scraped.name, scraped.specRows),
        ]);

        // phones table
        if (phone.status !== scraped.status) {
          logChange("CORRECT", "phones.status", phone.status, scraped.status);
          phoneUpdate.status = scraped.status;
          stats.syncChanges++;
        }
        if ((phone.price_pkr ?? null) !== scraped.price_pkr) {
          logChange(
            scraped.price_pkr === null ? "CLEAR" : "CORRECT",
            "phones.price_pkr",
            phone.price_pkr,
            scraped.price_pkr,
          );
          phoneUpdate.price_pkr = scraped.price_pkr;
          stats.syncChanges++;
        }
        if ((phone.expected_price_pkr ?? null) !== scraped.expected_price_pkr) {
          logChange(
            scraped.expected_price_pkr === null ? "CLEAR" : "CORRECT",
            "phones.expected_price_pkr",
            phone.expected_price_pkr,
            scraped.expected_price_pkr,
          );
          phoneUpdate.expected_price_pkr = scraped.expected_price_pkr;
          stats.syncChanges++;
        }

        // phone_specs — scraped value wins. Where whatmobile has nothing,
        // your value is kept (and formatted in step 2).
        for (const field of FILTERING_SCALARS) {
          const scrapedRaw = filtering[field] ?? null;
          if (scrapedRaw === null || scrapedRaw === undefined) continue;
          const yours =
            currentFiltering?.[field as keyof typeof currentFiltering] ?? null;
          if (String(yours ?? "") !== String(scrapedRaw)) {
            logChange(
              yours === null || yours === "" ? "FILL" : "CORRECT",
              `phone_specs.${field}`,
              yours,
              scrapedRaw,
            );
            filteringUpdate[field] = scrapedRaw;
            stats.syncChanges++;
          }
        }

        for (const field of BOOLEAN_FIELDS) {
          const theirs = filtering[field] === true;
          const yours = currentFiltering?.[field] === true;
          if (yours !== theirs) {
            logChange("CORRECT", `phone_specs.${field}`, yours, theirs);
            filteringUpdate[field] = theirs;
            stats.syncChanges++;
          }
        }

        // phone_extended_specs — whatmobile is authoritative; fields it
        // lacks are cleared to an empty string.
        for (const field of ALL_EXTENDED_COLUMNS) {
          const scrapedRaw: string | null = extended[field] ?? null;
          const yours =
            (currentExtended?.[field as keyof typeof currentExtended] as
              | string
              | null
              | undefined) ?? "";
          const target = scrapedRaw ?? "";

          if (target === yours) continue;

          const action =
            target === "" ? "CLEAR" : yours === "" ? "FILL" : "CORRECT";
          logChange(action, `extended.${field}`, yours, target);
          extendedUpdate[field] = target;
          stats.syncChanges++;
        }
      }
    }
  }

  // ═══ STEP 2: FORMAT — runs for EVERY phone, matched or not ════════════
  // Applied last, over the post-sync state, so corrected values and
  // untouched values alike end up in house style.
  let formattedThisPhone = 0;

  for (const field of FILTERING_SCALARS) {
    if (!FILTERING_TEXT_FIELDS.has(field)) continue;
    const pending = filteringUpdate[field];
    const current =
      pending !== undefined
        ? pending
        : currentFiltering?.[field as keyof typeof currentFiltering];
    if (typeof current !== "string" || current.trim() === "") continue;

    const formatted = formatSpecValue(current);
    if (formatted !== current) {
      logChange("FORMAT", `phone_specs.${field}`, current, formatted);
      filteringUpdate[field] = formatted;
      stats.formatChanges++;
      formattedThisPhone++;
    }
  }

  for (const field of ALL_EXTENDED_COLUMNS) {
    const pending = extendedUpdate[field];
    const current =
      pending !== undefined
        ? pending
        : (currentExtended?.[field as keyof typeof currentExtended] as
            | string
            | null
            | undefined);
    if (typeof current !== "string" || current.trim() === "") continue;

    const formatted = formatSpecValue(current);
    if (formatted !== current) {
      logChange("FORMAT", `extended.${field}`, current, formatted);
      extendedUpdate[field] = formatted;
      stats.formatChanges++;
      formattedThisPhone++;
    }
  }

  // ── Per-phone formatting result — always printed ──────────────────────
  if (formattedThisPhone > 0) {
    console.log(`   🎨 FORMATTED: ${formattedThisPhone} field(s) reformatted`);
    stats.phonesFormatted++;
  } else {
    console.log(
      `   🎨 FORMATTED: already in correct format — 0 field(s) changed`,
    );
  }

  // ── Tally & write ─────────────────────────────────────────────────────
  const totalChanges =
    Object.keys(phoneUpdate).length +
    Object.keys(filteringUpdate).length +
    Object.keys(extendedUpdate).length;

  if (totalChanges === 0) {
    stats.unchanged++;
    console.log(`   ✅ no changes needed`);
    return;
  }

  if (!APPLY) {
    console.log(`   📋 ${totalChanges} field(s) would change (dry run)`);
    return;
  }

  if (Object.keys(phoneUpdate).length) {
    const { error } = await supabase
      .from("phones")
      .update(phoneUpdate)
      .eq("id", phone.id);
    if (error) console.log(`   ❌ phones update failed: ${error.message}`);
  }
  if (Object.keys(filteringUpdate).length) {
    const { error } = currentFiltering
      ? await supabase
          .from("phone_specs")
          .update(filteringUpdate)
          .eq("phone_id", phone.id)
      : await supabase
          .from("phone_specs")
          .insert({ phone_id: phone.id, ...filteringUpdate });
    if (error) console.log(`   ❌ phone_specs failed: ${error.message}`);
  }
  if (Object.keys(extendedUpdate).length) {
    const { error } = currentExtended
      ? await supabase
          .from("phone_extended_specs")
          .update(extendedUpdate)
          .eq("phone_id", phone.id)
      : await supabase.from("phone_extended_specs").insert({
          phone_id: phone.id,
          ...Object.fromEntries(
            Object.entries(extendedUpdate).filter(([, v]) => v !== ""),
          ),
        });
    if (error) console.log(`   ❌ extended failed: ${error.message}`);
  }

  console.log(`   ✅ Applied ${totalChanges} field update(s)`);
}

async function fetchAllPhones(): Promise<PhoneRow[]> {
  const phones: PhoneRow[] = [];
  const PAGE_SIZE = 1000;
  let offset = 0;

  // Supabase silently caps every query at 1,000 rows — page through them all.
  while (true) {
    let query = supabase
      .from("phones")
      .select("id, name, slug, brand_id, status, price_pkr, expected_price_pkr")
      .order("created_at", { ascending: true })
      .range(offset, offset + PAGE_SIZE - 1);

    if (ONLY_SLUG) query = query.eq("slug", ONLY_SLUG);

    const { data: batch, error } = await query;
    if (error) {
      console.error("Failed to fetch phones:", error.message);
      process.exit(1);
    }
    if (!batch || batch.length === 0) break;

    phones.push(...(batch as PhoneRow[]));
    if (batch.length < PAGE_SIZE) break;
    offset += PAGE_SIZE;
  }

  return phones;
}

async function main() {
  const phones = await fetchAllPhones();
  console.log(`Processing ${phones.length} phone(s)...`);

  const browser = FORMAT_ONLY ? null : await chromium.launch();
  const page = browser ? await browser.newPage() : null;

  let processed = 0;
  for (const phone of phones) {
    processed++;
    if (processed % 50 === 0)
      console.log(`\n──── Progress: ${processed}/${phones.length} ────`);
    try {
      await processPhone(page, phone);
    } catch (err) {
      console.log(`   ❌ Error on ${phone.name}: ${err}`);
      notFound.push({
        name: phone.name,
        slug: phone.slug,
        reason: `error: ${err}`,
      });
    }
    if (!FORMAT_ONLY) await new Promise((r) => setTimeout(r, 2000));
  }

  if (browser) await browser.close();

  console.log("\n" + "═".repeat(64));
  console.log("  SUMMARY");
  console.log("═".repeat(64));
  console.log(`  Phones processed:                  ${phones.length}`);
  if (!FORMAT_ONLY) {
    console.log(`  Matched on whatmobile:             ${stats.matched}`);
    console.log(`  NOT found on whatmobile:           ${notFound.length}`);
    console.log(
      `  Sync changes (correct/fill/clear): ${stats.syncChanges} field(s)`,
    );
  }
  console.log(`  FORMATTED — fields reformatted:    ${stats.formatChanges}`);
  console.log(`  FORMATTED — phones affected:       ${stats.phonesFormatted}`);
  console.log(
    `  FORMATTING applied to:             ALL ${phones.length} phones (matched or not)`,
  );
  console.log(
    `  Already correct, untouched:        ${stats.unchanged} phone(s)`,
  );
  console.log("═".repeat(64));

  if (notFound.length > 0) {
    console.log(
      "\nPhones NOT found on whatmobile (specs not verified — but still formatted):\n",
    );
    notFound.forEach((p, i) =>
      console.log(
        `${String(i + 1).padStart(4)}. ${p.name}  (${p.slug})  — ${p.reason}`,
      ),
    );

    const reportPath = "not-found-phones.txt";
    fs.writeFileSync(
      reportPath,
      `${notFound.length} of ${phones.length} phones not found on whatmobile\n` +
        `Their specs were NOT verified against whatmobile, but they WERE formatted.\n` +
        `Generated: ${new Date().toISOString()}\n\n` +
        notFound
          .map(
            (p, i) =>
              `${i + 1}. ${p.name}\n   slug: ${p.slug}\n   reason: ${p.reason}\n`,
          )
          .join("\n"),
    );
    console.log(`\n📄 Full list written to ${reportPath}`);
  }

  console.log(
    APPLY
      ? "\n✅ Done. All changes applied and everything formatted."
      : "\n🔍 Dry run complete. Re-run with --apply to write.",
  );
}

main();
