# MobileWala

MobileWala is a mobile phone price comparison and news platform built for
the Pakistani market. Visitors can browse phones by brand, price range,
RAM, screen size, camera, network type, and other filters; compare two
phones side by side with a full spec diff; read phone-related news
articles; and browse deals and offers from local shops and affiliate
partners.

## What it does

Every phone has two separate layers of specification data. A set of
fixed, structured fields (RAM, storage, camera megapixels, battery
capacity, network type, operating system, and a handful of boolean
feature flags) powers all of the filtering and category browsing — these
fields are never shown directly to visitors. What visitors actually see
is a separate, fully admin-authored spec table, organized into groups
like Build, Display, Processor, Camera, Connectivity, and Battery,
written using a rich text editor so specs can include formatting,
multi-line detail, and free-form notes rather than being limited to plain
values. Any row left blank simply doesn't appear on the public page.
Price is tracked once, in Pakistani Rupees, and the equivalent US Dollar
amount shown across the site is calculated live from a single,
admin-editable exchange rate rather than being entered separately for
each phone.

The site includes a full admin panel for managing all of this content.
Two roles exist: admins can create, edit, and delete anything, while
editors can create and edit but not delete. Adding a new phone walks
through a guided, multi-step process — first the filtering details, then
photos, then the full public spec table — with a clear confirmation at
the end and the option to immediately add another. The same kind of
guided, confirmable flow applies to adding brands, news articles, and
offers. Beyond content, the admin panel also controls which phones appear
in each homepage section (with unpinned slots automatically filling in
the latest matching phones by price bracket), site-wide settings like the
exchange rate and social media links, two sellable banner placements
(homepage and sidebar), and a simple inbox for messages submitted through
the site's contact and advertising-inquiry forms.

On the public side, the homepage highlights featured phones and a run of
price-bracket sections, each linking to its own dedicated listing page.
Every phone, brand, and news article has its own page with full
structured data for search engines, a proper social sharing preview, and
a canonical URL, and the whole site is set up to be indexed quickly by
both Google and Bing/Yandex whenever new content is published.
Advertising is built in but handled carefully: display ad units only
appear once real ad IDs are configured, they load lazily as a visitor
scrolls near them rather than all at once, and there are no popups or
intrusive interstitial ads anywhere on the site. Alongside programmatic
ads, the site has its own direct-advertising pages — an "Advertise With
Us" page with an inquiry form, and a media kit page for sharing traffic
and audience details with potential advertisers — plus a dedicated deals
and offers section where local shops and affiliate partners can be
featured.

The site is built around Pakistan specifically: prices are shown in
Rupees first, the stolen-phone guide walks through Pakistan's real
PTA/DIRBS phone registration and IMEI-checking process, and the whole
content and category structure is designed around how people in Pakistan
actually search for and compare phones.

## Technology

The site is built on **Next.js 16** using the App Router, with
**Turbopack** as the bundler and the **React Compiler** enabled for
automatic memoization, running on **React 19**. Styling is done with
**Tailwind CSS v4**. All of the site's data — phones, brands, news,
offers, settings, and admin accounts — is stored in **Supabase**
(Postgres, with its own authentication and row-level security), accessed
through the current publishable/secret key system rather than the older
legacy keys. Product and article photos are hosted and served through
**Cloudinary**, resized and optimized automatically for each place an
image appears on the site.

Forms throughout the site — both public-facing ones like contact and
advertising inquiries, and every admin content form — are built with
**react-hook-form** for form state and **Zod** for validation, so the
same rules apply consistently whether someone is submitting a message or
an admin is publishing a new phone. The rich text editing used for spec
tables and phone descriptions is powered by **Tiptap**, with all saved
content run through a sanitization step (DOMPurify) both when it's saved
and again when it's displayed, so formatted admin content can never
introduce unsafe markup onto the public site.

For search visibility, every page includes structured data (JSON-LD)
describing what it is — a product, an article, a breadcrumb trail, or a
list — and the site automatically generates a sitemap and robots file on
every deployment. New and updated content is also pushed directly to
Bing and Yandex's indexing systems the moment it's published, rather than
waiting for those search engines to discover it on their own. Advertising
is integrated through Google AdSense, with ad units that only render once
they've actually been configured with real ad slot IDs, and that load in
only as a visitor scrolls near them instead of all loading up front.

The project is deployed on **Vercel** and built with **pnpm** as the
package manager.