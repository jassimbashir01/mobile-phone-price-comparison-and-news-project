# MobileWala

**A programmatic-SEO mobile phone price comparison platform for the Pakistani market.**

MobileWala is a production content platform serving ~2,500 phone specification
pages, brand catalogues, price-bracket categories, news articles and a
comparison tool — built as a single Next.js application with a Supabase
backend, a custom admin CMS, an integrated monetization layer and an
installable PWA shell.

It is not a CRUD demo. The interesting parts of this repository are the
decisions: a two-table specification model that separates filtering from
display, a rendering strategy that keeps 2,500+ pages statically generated
without a slow build, a caching layer that trades freshness for bandwidth on
purpose, and a monetization system that fails safe when unconfigured.

> **Status:** feature-complete, pre-launch. Deployed behind a deliberate
> sitewide `noindex` while catalogue data is verified — see
> [Launch Controls](#launch-controls).

```
Live:  coming soon
Stack: Next.js 16 · React 19 · TypeScript · Tailwind v4 · Supabase · Cloudinary · Vercel
```

> **This is proprietary source code, published for portfolio review only.**
> All rights reserved. See [License](#license).

---

## Table of Contents

- [Project Description](#project-description)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Architecture & System Design](#architecture--system-design)
  - [Why this stack](#why-this-stack)
  - [Data model](#data-model)
  - [Rendering & revalidation strategy](#rendering--revalidation-strategy)
  - [SEO architecture](#seo-architecture)
  - [Caching & the PWA layer](#caching--the-pwa-layer)
  - [Security model](#security-model)
  - [Monetization architecture](#monetization-architecture)
  - [Image pipeline](#image-pipeline)
- [Engineering Problems Worth Reading](#engineering-problems-worth-reading)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Scripts & Tooling](#scripts--tooling)
- [Performance](#performance)
- [Launch Controls](#launch-controls)
- [Roadmap & Deliberate Deferrals](#roadmap--deliberate-deferrals)
- [Contributing](#contributing)
- [License](#license)

---

## Project Description

Pakistan's phone-buying market is price-sensitive and search-driven. Buyers
search for a specific model plus a price, in PKR, and expect a spec sheet they
can trust. MobileWala targets that intent directly with a large surface of
programmatically generated, individually optimized pages.

**The core problem the architecture solves:** generate thousands of
search-visible, fast-loading, structured-data-rich pages from a normalized
database, while keeping hosting and image-delivery costs viable in a low-CPM
advertising market — and while remaining fully editable by a non-technical
content editor.

Every significant decision in this codebase traces back to one of four
constraints:

| Constraint | Consequence in the code |
|---|---|
| **Low ad revenue per visitor** (Pakistan is a low-CPM market) | Aggressive caching, fixed-size image URLs, ISR over SSR — bandwidth is the dominant variable cost |
| **Search is the only meaningful acquisition channel** | Programmatic page generation, JSON-LD on every template, dual sitemaps, IndexNow push |
| **Content is edited by a non-developer** | Full admin CMS, role-scoped permissions, partial-pinning UX, in-app content guidance |
| **~2,500 rows and growing** | Generated sort columns, composite indexes, paginated queries, capped `generateStaticParams` |

---

## Features

### Public site

- **Programmatic phone pages** — spec sheet, image gallery, price in PKR with
  live USD conversion, share buttons, and four algorithmic related-phone rails
  (similar price, better alternatives, cheaper alternatives, same chipset)
- **Faceted browsing** — brand, price bracket, RAM, storage, screen size,
  camera, OS, network generation, and feature type, each a distinct indexable
  route with its own metadata and copy
- **Multi-tier catalogue sort** — Coming Soon first, then Coming Soon with an
  expected price, then available phones high-to-low, then discontinued
- **Side-by-side comparison** with a full extended-spec diff table
- **Live search** with a debounced combobox dropdown backed by a Postgres RPC
- **News section** with rich-text articles, brand association and an RSS feed
- **Deals & Offers** — affiliate links and local-shop listings
- **Stolen Phone Guide** — a PTA/DIRBS-specific editorial resource built as a
  link magnet
- **Installable PWA** with offline support and a platform-aware install prompt
- **Email capture** for launch and price-drop notifications

### Admin CMS

- Email/password auth via Supabase, with an `admin` / `editor` role split
  (editors create and edit; only admins delete)
- Wizard-driven phone creation: core fields → extended specs → images
- Rich-text editing with live word counters against per-field content targets
- Drag-to-reorder image management with primary-image selection
- **Homepage section editor with partial pinning** — pin zero phones and the
  section auto-fills; pin three and the remaining three auto-fill
- Paginated list views on every entity
- Site settings: exchange rate, social links, media-kit stats, three sold
  banner placements, footer brand selection
- Contact and advertise inbox
- Subscriber list
- In-app content guidance page with word-count targets per content type

### SEO & discoverability

- `Product`, `Article`, `BreadcrumbList`, `ItemList` and `Organization` JSON-LD
- Canonical URLs, Open Graph and Twitter cards on every route
- Auto-generated `sitemap.xml` plus a dedicated **image sitemap** for Google
  Images
- **IndexNow** push to Bing and Yandex on every content mutation
- On-demand ISR revalidation so edits appear immediately rather than on a timer

---

## Technologies Used

| Layer | Choice | Notes |
|---|---|---|
| Framework | **Next.js 16** (App Router) | `proxy.ts` replaces `middleware.ts`; React Compiler enabled |
| UI | **React 19.2**, **Tailwind CSS v4** | CSS-first Tailwind config via `@theme` |
| Language | **TypeScript** (strict) | Zod schemas as the single source of truth for form + server validation |
| Database | **Supabase** (Postgres) | Row Level Security, generated columns, composite indexes, one RPC for search |
| Auth | **Supabase Auth** | Cookie-based sessions, role stored in `user_profiles` |
| Media | **Cloudinary** | Fixed-size transformation URLs; server SDK for lifecycle cleanup |
| Editor | **Tiptap** | Sanitized server-side with `isomorphic-dompurify` |
| PWA | **Serwist** | Custom service worker, versioned cache invalidation |
| Analytics | **Google Tag Manager** | Chosen over direct GA4 — see [rationale](#why-gtm-over-ga4) |
| Monetization | **Google AdSense** + direct-sold placements | 14 slot positions, 3 sold banners |
| Hosting | **Vercel** | ISR, on-demand revalidation, image optimization bypassed by design |
| Tooling | **pnpm**, **ESLint 9** (flat config), **Playwright** | Playwright used for data-maintenance scripts, not tests |

---

## Architecture & System Design

### Why this stack

**Next.js App Router over a decoupled SPA + API.** The product is
search-acquisition-driven, so server-rendered HTML with real metadata is a
requirement, not a preference. ISR gives static-file performance with
database-backed content and no rebuild-per-edit.

**Supabase over a hand-rolled backend.** Postgres with RLS, auth, and a
generated type-safe client removes an entire service tier. The escape hatch
matters: when the query planner needed help, adding a composite index or a
generated column was a one-line migration rather than an ORM fight.

**Server Actions over API routes for mutations.** Every write is a server
action that calls `requireRole()` first. Validation is a Zod schema shared
between the client form and the server handler, so the two cannot drift.

<a name="why-gtm-over-ga4"></a>
**GTM over direct GA4.** The site has direct ad sales and affiliate offers,
which means additional tracking pixels are a matter of when, not if. GTM makes
those changes a dashboard operation rather than a code deploy. A build-time
guard throws if both `NEXT_PUBLIC_GTM_ID` and `NEXT_PUBLIC_GA4_ID` are set,
because double-counted pageviews are the kind of bug you discover three months
of bad data later.

### Data model

```
brands ──┬── phones ──┬── phone_specs           (1:1, filtering)
         │            ├── phone_extended_specs  (1:1, display)
         │            └── phone_images           (1:N)
         └── news

homepage_sections   offers   site_settings   contact_messages
user_profiles       email_subscribers
```

**The central design decision: two specification tables.**

`phone_specs` holds a small, fixed set of **typed** columns — `ram_gb integer`,
`display_size numeric`, `battery_mah integer`, plus eight booleans. This table
exists solely to be queried. Every facet route (`/ram/8gb`, `/camera/50mp`,
`/type/5g-phones`) filters against it, and because the columns are correctly
typed, those filters use indexes instead of casting text at query time.

`phone_extended_specs` holds ~47 **nullable text** columns grouped into nine
sections (Build, Frequency, Processor, Display, Memory, Camera, Connectivity,
Features, Battery), each with an `_extra` catch-all. This table exists solely to
be rendered. It stores the full human-readable spec sheet — complete frequency
band lists, sensor enumerations, charging details — with no attempt to normalize
values that will never be queried.

The alternative designs and why they lost:

- **One wide table** — filtering columns and display columns have opposite
  requirements. Typed and indexed versus permissive and verbose. Merging them
  means either lossy display data or unqueryable filter data.
- **A key/value spec table** (`phone_id, key, value`) — maximally flexible,
  but every facet page becomes a self-join or a pivot, and the query planner
  loses the ability to use a straightforward composite index. Flexibility
  nobody asked for, paid for in query complexity forever.

The duplication between the two tables (RAM appears in both) is deliberate and
documented: one copy is the queryable integer, the other is the display string
with its original phrasing intact.

**Generated columns for multi-tier sorting.** The catalogue sort — Coming Soon
without a price, then Coming Soon with an expected price descending, then
available descending, then discontinued descending — is not expressible in a
single `ORDER BY` over the base columns. Two `STORED GENERATED` columns solve
it:

```sql
sort_tier  -- 0 = coming soon (no price), 1 = coming soon (expected),
           -- 2 = available, 3 = discontinued
sort_price -- expected_price for tier 1, price for tiers 2–3,
           -- coalesced to -1 so unpriced phones sink within their tier

CREATE INDEX idx_phones_sort ON phones (sort_tier, sort_price DESC);
```

Postgres maintains both on write; every listing query is a plain
`.order('sort_tier').order('sort_price', { ascending: false })` that reads
straight off the index. No sort in application code, and pagination with an
exact count still works.

### Rendering & revalidation strategy

| Route type | Strategy | Revalidate | Reasoning |
|---|---|---|---|
| Phone detail | SSG + ISR | 24h | 2,500+ pages; content is stable once entered |
| Category / brand | Dynamic + ISR | 6h | Membership changes when phones are added |
| Homepage | Static + ISR | 1h | Featured sections and prices are the freshest content |
| News article | SSG + ISR | 1h | |
| Admin | `force-dynamic` | never | Stale admin data is actively harmful |
| Search, compare | Dynamic | never | Inherently per-request |

**On-demand revalidation closes the freshness gap.** A 24-hour ISR window is
fine for a spec sheet and unacceptable for a price. Every mutating server action
calls `triggerRevalidate(paths)`, which POSTs to an internal
`/api/revalidate` route guarded by a timing-safe secret comparison. An editor
changes a price and the public page reflects it on the next request, not
tomorrow.

**`generateStaticParams` is capped deliberately.** Prerendering all 2,500 phones
means 2,500 × ~8 queries per build. The cap trades a small first-visit penalty
on long-tail pages (immediately cached afterwards) for build times that stay in
seconds rather than minutes.

### SEO architecture

Programmatic SEO only works if each generated page is genuinely differentiated,
so the code enforces that:

- **Every facet route has its own hand-written copy** — H1, meta description
  and an on-page intro paragraph, not a template with a variable substituted.
- **`/price/{range}` and `/price-range/{range}` are deliberately different
  pages.** Same underlying data, different intent: one is the complete
  catalogue for a bracket, the other is a curated "best of" list, with distinct
  titles and copy. Two near-identical pages would have been a self-inflicted
  duplicate-content problem.
- **JSON-LD is generated, not hardcoded.** `buildProductJsonLd` handles the
  cases that matter: price serialized as a string (Google rejects numerics),
  `status` mapped to the correct `schema.org` availability URI, and the `offers`
  block omitted entirely when there is no price — because a Product with no
  Offer is valid schema, whereas a fabricated price is a trust problem.
- **Dual sitemaps.** `next-sitemap` generates the standard sitemap at build
  time; a separate dynamic route emits an `<image:image>` sitemap so the phone
  photography is discoverable in Google Images as its own traffic channel.
- **IndexNow** pushes changed URLs to Bing and Yandex on every mutation,
  gated behind the same launch flag as indexing itself.

### Caching & the PWA layer

The service worker is tuned for **cost** first and freshness second — a
deliberate trade, given the revenue-per-visitor reality of the target market.

```
Cloudinary images  → CacheFirst, 90 days   (public_id changes on replace,
                                            so a cached URL cannot go stale)
Next static assets → CacheFirst, 1 year    (content-hashed filenames)
Fonts              → CacheFirst, 1 year
Page navigations   → CacheFirst, 30 days   ← the aggressive one
RSC payloads       → CacheFirst, 30 days
Internal API       → StaleWhileRevalidate
/api/cache-version → NetworkFirst          ← must be first in the matcher list
/admin, /login     → NetworkFirst          ← never cached
```

`CacheFirst` on navigations is what makes this cheap, and it would normally make
content updates invisible to returning users. The fix is an explicit
invalidation channel: every admin mutation bumps a version integer in
`site_settings`; a client-side watcher polls a lightweight version endpoint and,
on a change, messages the service worker to purge its page caches and reloads.

Two ordering details that are load-bearing:

- The version endpoint's rule must precede the generic `/api/` rule. Cache the
  version number and invalidation silently dies forever.
- Admin routes are excluded explicitly rather than relying on them not matching.

**Art direction, not CSS cropping.** The homepage hero uses a `<picture>`
element with two purpose-built images — a 6:1 desktop crop and a 3:1 mobile
crop. `object-cover` on a single wide image would have kept only the middle
~50% on a phone, cutting the wordmark off one edge and the artwork off the
other. The browser downloads exactly one.

### Security model

Defence is layered, and the boundary is the server — never the form.

- **RLS on every table.** Public read policies where reads are public;
  `contact_messages` and `email_subscribers` have *no* public policy at all and
  are written exclusively through the secret-key admin client inside server
  actions.
- **`requireRole()` opens every mutation.** Editors write, admins delete. The
  check is server-side; the client UI merely reflects it.
- **URL scheme validation.** `z.string().url()` accepts `javascript:` — it is a
  syntactically valid URL. Every user-supplied URL that becomes a live `href`
  (banners, offers, social links, rich-text links) goes through a schema that
  requires `http(s)://`.
- **HTML sanitization** on all rich text, server-side, before storage.
- **JSON-LD injection guard** — `<` escaped to `\u003c` before serialization,
  because JSON-LD is injected into a `<script>` block.
- **Timing-safe secret comparison** on the revalidation endpoint.
- **Shared rate limiter** across the contact, advertise and subscribe forms.
- **Admin is `noindex`** and gated at the edge in `proxy.ts`.

### Monetization architecture

Three revenue channels, one design principle: **nothing renders until it is
genuinely configured.**

**AdSense** — 14 named slot positions behind a single `AdSlot` component. Each
slot self-hides unless *both* the publisher ID and that slot's own unit ID are
real values rather than placeholders. Half-configured ad units produce
malformed requests and policy problems; rendering nothing is strictly better.
Consolidating every placement behind one component also means a future migration
to a premium network is a change to one file, not to every page.

**Direct-sold banners** — homepage, sidebar and footer placements stored in
`site_settings` as JSONB. Each is upload, link, alt text and an enable flag.
Disabled or incomplete placements render `null`. The homepage placement falls
back to a branded house creative rather than collapsing the layout — which also
guarantees a stable LCP element.

**Offers** — affiliate links and local-shop listings with `rel="sponsored"`,
managed as a first-class content type.

### Image pipeline

Cloudinary is used as an optimizing CDN, with Next's image optimizer
deliberately bypassed (`unoptimized`):

```ts
cloudinaryUrl(publicId, { width: 170, height: 310 })
// → /image/upload/c_limit,w_170,h_310,f_auto,q_auto/{publicId}
```

One exact size per rendered context — 2× the CSS dimensions for retina, with
`c_limit` preventing upscaling and `f_auto,q_auto` handling format and quality
negotiation. Routing this through Vercel's optimizer afterwards would be
duplicate processing and duplicate cost.

**Asset lifecycle is handled explicitly.** Deleting a database row does nothing
to a remote CDN object. Every delete and replace path — phones (multi-image),
news covers, offer images, brand logos, and all three banner placements —
destroys the corresponding Cloudinary asset. Replacements compare old against
new and only destroy what genuinely changed, so re-saving a form without
touching the image is a no-op.

---

## Engineering Problems Worth Reading

These are the bugs and constraints that shaped the code. They are documented
because the fixes are more interesting than the features.

### 3840px images in 85px containers

Phone cards were downloading near-4K images. The responsive-image wrapper
generated a `srcset` from 32w to 3840w, and when its `sizes` hint failed to
apply, the browser fell back to the `src` attribute — which the library had set
to the *largest* variant. At 96 cards per page, every listing page was pulling
tens of megabytes of images to render thumbnails.

Diagnosed by reading `img.currentSrc` in the console rather than trusting the
rendered markup. Fixed by dropping the wrapper entirely in favour of explicit
fixed-size Cloudinary URLs — no `srcset`, no negotiation, no failure mode.
Almost certainly the single largest bandwidth reduction in the project.

### A build that timed out at 2,500 rows

`Error: canceling statement due to statement timeout` during static generation.
The related-phones query filtered on `(brand_id, status)` and ordered by
`sort_order` with no index covering that combination — a full scan plus a sort,
executed once per phone page, 2,500 times per build. One of them crossed
Postgres's statement timeout and killed the build.

Three composite indexes took the build from failing to 55 seconds. They are
committed to the schema reference file, because a database rebuilt without them
would reintroduce the failure with no obvious cause.

### Supabase's silent 1,000-row ceiling

`generateStaticParams` was quietly prerendering exactly 1,000 phones out of
2,500. Supabase caps every query at 1,000 rows by default — no error, no
warning, no truncation notice. The sitemap was equally short.

Every unbounded query is now explicitly paginated with a stable sort key. The
lesson generalized: an ORM default that silently changes your result set is
worse than one that throws.

### Turbopack silently skipping the service worker

Next 16 warns when a webpack config exists under Turbopack. Adding
`turbopack: {}` silenced the warning — and the build kept succeeding while
producing no service worker at all, because Turbopack does not run webpack
plugins. The PWA had simply stopped existing.

Production builds now run `next build --webpack` explicitly; dev keeps
Turbopack. That in turn surfaced a bundling failure in a transitive JSDOM
dependency, resolved via `serverExternalPackages`.

### A "create another" button that did nothing

Post-creation success screens rendered on the same URL as their own "create
another" link. Clicking it navigated to the page the user was already on, so the
router correctly did nothing, the component never remounted, and its local
success state never cleared.

Fixed by replacing the navigation with a state reset. The interesting part is
the diagnosis: the URL bar updated and the server logged a 200, which made it
look like a rendering bug rather than a no-op navigation.

### Partial pinning as a UX primitive

The homepage section editor lets an editor pin some phones and let the rest
fill automatically — pin none and the section is fully automatic; pin three of
six and three auto-fill. This runs through one query function parameterized by
a fallback descriptor (price bracket, or status for the Latest and Coming Soon
rails), so the admin preview and the live homepage are guaranteed to agree
because they call the same code path with the same arguments.

---

## Installation

> This repository is proprietary. Setup instructions are provided so the
> architecture can be evaluated, not as a grant of permission to deploy or
> distribute the software. See [License](#license).

### Prerequisites

- Node.js 20+
- pnpm 9+
- A Supabase project
- A Cloudinary account

### Setup

```bash
git clone https://github.com/jassimbashir01/mobile-phone-price-comparison-and-news-project.git
cd mobile-phone-price-comparison-and-news-project
pnpm install
```

Create `.env.local`:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxxxx
SUPABASE_SECRET_KEY=sb_secret_xxxxx

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=xxxxx
CLOUDINARY_API_SECRET=xxxxx

# Site
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_LIVE=false          # false = sitewide noindex + IndexNow paused

# Revalidation
REVALIDATE_SECRET=a-long-random-string

# SEO
INDEXNOW_KEY=your-indexnow-key

# Analytics (set ONE, not both — a build guard enforces this)
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
# NEXT_PUBLIC_GA4_ID=G-XXXXXXX

# Monetization (placeholders are safe — ad slots self-hide)
NEXT_PUBLIC_ADSENSE_PUB_ID=ca-pub-XXXXXXXXXXXXXXXX

# Data-maintenance scripts only
OPENAI_API_KEY=sk-xxxxx
```

Apply the database schema:

```bash
# Run schema.sql in the Supabase SQL Editor.
# It creates tables, RLS policies, the search RPC,
# generated sort columns, and required indexes.
```

Create your first admin user:

```sql
-- After signing up through /login:
UPDATE user_profiles SET role = 'admin' WHERE id = '<auth-user-id>';
```

Run it:

```bash
pnpm dev          # http://localhost:3000
```

> The service worker is disabled in development by design — a stale worker
> masks code changes. To test the PWA: `pnpm build && pnpm start`.

---

## Usage

### Development

```bash
pnpm dev                  # dev server (Turbopack)
pnpm build                # production build (webpack — required for the SW)
pnpm start                # serve the production build
pnpm lint                 # ESLint
pnpm exec tsc --noEmit    # typecheck
```

### Adding a phone

1. `/admin/phones/new`
2. **Step 1** — brand, name, slug, status, price, SEO description, overview,
   description. `Coming Soon` reveals an optional expected-price field.
3. **Step 2** — extended specs across nine grouped sections.
4. **Step 3** — images; drag to reorder, click to set primary.

The public page, its brand page, matching category pages and the homepage
revalidate immediately, and the URL is pushed to IndexNow.

### Configuring a sold banner

`/admin/settings` → choose a placement → upload creative → destination URL →
alt text → enable. Recommended dimensions are shown inline and mirrored on the
public `/advertise` page (1800×300 landscape, 800×800 square).

### Homepage curation

`/admin/featured` → pick a section → pin specific phones, or pin nothing and
let it fill automatically. Unpinned slots are labelled as auto-filled so the
editor can see what is curated and what is not.

---

## Project Structure

```
src/
├── app/
│   ├── (public routes)          # phone, brand, price, ram, camera, os, type…
│   ├── admin/                   # CMS — force-dynamic, role-gated
│   ├── api/
│   │   ├── revalidate/          # on-demand ISR, timing-safe secret
│   │   ├── cache-version/       # PWA invalidation signal
│   │   ├── upload/              # Cloudinary signed upload
│   │   └── phones/              # search + detail JSON for client components
│   ├── sitemap-images.xml/      # dynamic image sitemap
│   ├── sw.ts                    # service worker source (Serwist)
│   └── layout.tsx
├── components/
│   ├── admin/                   # CMS UI
│   ├── phone/ news/ offers/     # domain components
│   ├── compare/ layout/ seo/    # feature + shell components
│   └── ads/                     # AdSlot, AnchorAd — self-hiding
├── lib/
│   ├── actions/                 # server actions (all mutations)
│   ├── validation/              # Zod schemas — shared client + server
│   ├── supabase/                # public, server and admin clients
│   ├── cloudinaryUrl.ts         # fixed-size URL builder
│   ├── cloudinary.ts            # server SDK — asset lifecycle
│   ├── revalidate.ts            # ISR + IndexNow + cache-version bump
│   ├── seo.ts                   # JSON-LD builders
│   └── rateLimit.ts
├── queries/                     # read-side data access
├── types/database.ts            # hand-maintained DB types
└── proxy.ts                     # Next 16 middleware — admin gate

scripts/                         # data-maintenance CLI (not shipped)
```

**The `lib/actions` ÷ `queries` split is intentional.** Everything in
`actions/` is `"use server"`, mutating, and role-gated. Everything in
`queries/` is read-only and safe to call from any server component. The
boundary is visible in the import path, which makes "does this write?"
answerable without opening the file.

---

## Scripts & Tooling

A CLI tool under `scripts/` handles bulk catalogue maintenance. It is
development tooling, not application code.

```bash
# Format every spec value to house style — no network, no cost, seconds
pnpm exec tsx scripts/syncExtendedSpecs.ts --format-only --apply

# Verify one phone, print every proposed change, write nothing
pnpm exec tsx scripts/syncExtendedSpecs.ts --slug=some-phone --debug

# Full pass: verify against source, correct, then format everything
pnpm exec tsx scripts/syncExtendedSpecs.ts --apply
```

Design constraints worth noting:

- **Dry run by default.** Nothing is written without `--apply`.
- **Nothing is invented.** The AI mapping step is instructed that a `null` is
  strictly better than a guess, and gap-filling from model knowledge is
  explicitly forbidden. Every written value traces to verified source data.
- **Spec extraction is split into two independent AI calls** — one for the
  typed filtering fields, one for the display fields — so the two cannot
  contaminate each other's output.
- **Every action is logged and classified** — `FILL`, `CORRECT`, `CLEAR`,
  `FORMAT` — with before/after values, plus a written report of every phone
  that could not be verified.

The formatter is worth a note of its own. Blanket title-casing would turn
`AMOLED` into `Amoled` and `mAh` into `Mah`. Instead it title-cases only
fully-lowercase words, leaves anything containing a capital untouched, and
applies a canonical-form lookup for known technology terms — so
`SMS(threaded view)` becomes `SMS (Threaded View)` while `iOS`, `aptX`,
`LTPO AMOLED` and `T606` survive intact.

---

## Performance

Measured against a production build:

| Metric | Value |
|---|---|
| Static pages generated | 2,651 |
| Static generation time | ~55s |
| Compile time | ~6s |
| Phone detail TTFB | cached at the edge after first request |
| Card image payload | reduced from multi-MB to a fixed 170×310 request |

**LCP handling.** Exactly one image per page template receives `priority` — the
homepage hero, the first grid card on listing pages, the gallery's first image
on detail pages. Marking several competes for bandwidth and can make LCP worse;
the element is verified per template rather than assumed.

**Pagination sized to the grid.** Listing pages show 96 phones — a multiple of
3, 4 *and* 6, matching the grid's three breakpoints, so no page ever ends in a
ragged partial row. Mid-grid ad slots sit at indexes 11 and 47, also on row
boundaries.

---

## Launch Controls

The site can be deployed publicly while remaining entirely invisible to search
engines — so catalogue data can be verified in production before any of it is
indexed.

```bash
NEXT_PUBLIC_SITE_LIVE=false   # → X-Robots-Tag: noindex, nofollow sitewide
                              # → IndexNow push disabled
```

`X-Robots-Tag` is an HTTP header respected by Google, Bing, Yandex and Baidu
alike, so one switch covers all of them. IndexNow is paused by the same flag —
otherwise every content edit would actively invite crawlers to pages that are
not ready.

Flipping the flag to `true` and redeploying opens indexing. Sitemaps are
submitted manually after that point, not before.

---

## Roadmap & Deliberate Deferrals

Each of these was a decision, not an oversight. Each has a stated trigger for
revisiting it.

| Deferred | Revisit when |
|---|---|
| Distributed rate limiting (Redis) | Spam gets through the in-memory limiter, or a fourth public form shares the budget |
| Premium ad network migration | ~10k–50k sessions/month; already isolated behind one component |
| Search arrow-key navigation | Self-contained; combobox ARIA is already in place |
| Self-serve ad payment (Stripe) | Manual placement setup becomes a real time cost |
| Admin-definable spec fields | A genuinely new spec type is needed across many phones |
| News brand-filter pagination | 400+ published articles (currently fetches and filters in memory to work around a PostgREST join-filter quirk) |

---

## Contributing

> **Note on ownership.** This project is proprietary and not open source.
> Issues, bug reports and code review are genuinely welcome — but any accepted
> contribution is incorporated into a proprietary codebase, and by submitting
> one you agree that the copyright holder retains all rights to the combined
> work. If you would rather not, feedback via an issue is just as useful as a
> pull request.

The conventions below matter more than usual, because this is a production
codebase rather than a sample.

### Getting started

1. Fork and branch from `main` (`feat/…`, `fix/…`, `docs/…`)
2. `pnpm install`
3. Follow [Installation](#installation) with your own Supabase and Cloudinary
   credentials — never commit real ones

### Before opening a PR

```bash
pnpm exec tsc --noEmit    # must pass clean
pnpm lint                 # zero errors
pnpm build                # must complete, including SW generation
```

### Conventions

- **Validation lives in `lib/validation/`.** One Zod schema per entity, imported
  by both the form and the server action. Never validate in two places.
- **Mutations are server actions and begin with `requireRole()`.** No exceptions.
- **Reads go in `queries/`, writes go in `lib/actions/`.** The import path
  should tell a reader whether a function mutates.
- **Every query that could return more than 1,000 rows must paginate
  explicitly.** Supabase truncates silently.
- **Images use `cloudinaryUrl()` with an explicit size.** Do not reintroduce
  responsive `srcset` for fixed-dimension contexts.
- **New ad placements go through `AdSlot`** and must self-hide when
  unconfigured.
- **Content mutations must call `triggerRevalidate()`** with the affected paths.
- Comments should explain *why*, not *what*. The non-obvious constraint is the
  thing worth writing down.

### Reporting bugs

Include the route, whether it reproduces in a production build (`pnpm build &&
pnpm start`) as well as dev, and the terminal output. Several bugs in this
project's history looked like rendering issues and were actually stale service
workers or silent query truncation — a production-build check separates those
quickly.

---

## License

**Copyright © 2026–present Mohammad Jassim (Jassim Bashir). All rights reserved.**

This source code is made publicly viewable for the sole purpose of portfolio
review and technical evaluation. It is **not** open source and no licence is
granted.

Without prior written permission from the copyright holder, you may **not**:

- use this software, in whole or in part, for any purpose
- copy, reproduce or redistribute the source code
- modify, adapt or create derivative works
- publish, host or deploy this software or anything derived from it
- use it commercially, or incorporate any part of it into another project

You **may** read the source code and reference it when evaluating the author's
work.

The software is provided "as is", without warranty of any kind, express or
implied. The copyright holder accepts no liability for any claim, damages or
other liability arising from the software or its use.

For licensing or permission enquiries:
[mohammadjassimbashir@proton.me](mailto:mohammadjassimbashir@proton.me)

---

<div align="center">

**Built by Jassim Bashir**

[Portfolio](https://www.jassimbashir.com) · [LinkedIn](https://www.linkedin.com/in/jassimbashir) · [Email](mailto:mohammadjassimbashir@proton.me)

</div>