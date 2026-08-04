# MobileWala

**MobileWala** is a comprehensive mobile phone comparison, pricing, and news platform designed specifically for the Pakistani market. The platform enables users to explore smartphones by brand, price range, specifications, and features, compare devices side by side, stay informed with the latest mobile industry news, and discover offers from local retailers and affiliate partners.

---

# Features

## Phone Discovery

Users can browse and search phones using a wide range of filters, including:

* Brand
* Price range
* RAM
* Storage
* Display size
* Camera resolution
* Battery capacity
* Network support
* Operating system
* Additional hardware and software features

Each phone includes a detailed specification page with an intuitive layout, while a dedicated comparison tool allows visitors to compare two devices side by side with a complete specification breakdown.

---

## Dual-Layer Specification System

The platform separates technical data into two independent layers.

### Structured Specifications

A collection of normalized fields powers filtering, searching, and category pages. These include attributes such as:

* RAM
* Storage
* Battery capacity
* Camera megapixels
* Operating system
* Network compatibility
* Boolean feature flags

These values are optimized for querying and are not displayed directly on the public website.

### Public Specification Tables

The information presented to visitors is managed independently through a rich-text specification system. Specifications are organized into sections such as:

* Build
* Display
* Processor
* Camera
* Connectivity
* Battery

Because the content is authored using a rich text editor, administrators can include formatted text, multi-line descriptions, and detailed notes instead of being restricted to plain values. Empty specification rows are automatically omitted from the public page.

---

## Dynamic Pricing

Phone prices are maintained in **Pakistani Rupees (PKR)**.

Equivalent **USD prices** are calculated automatically using a single administrator-managed exchange rate, eliminating the need to maintain separate prices for each device.

---

# Administration

MobileWala includes a comprehensive administration panel for managing all platform content.

## User Roles

Two permission levels are available:

* **Administrator** – Full access to create, edit, and delete all content.
* **Editor** – Can create and edit content but cannot delete records.

## Guided Content Management

Adding new content follows a guided multi-step workflow with confirmation screens.

Supported content includes:

* Phones
* Brands
* News articles
* Deals and offers

The phone creation workflow guides administrators through:

1. Structured filtering data
2. Image uploads
3. Public specification tables
4. Final review and confirmation

After publishing, administrators can immediately begin creating another item.

---

## Homepage Management

The administration panel allows complete control over homepage content.

Administrators can:

* Pin featured phones
* Configure homepage sections
* Automatically populate remaining slots with the latest matching phones within predefined price brackets

---

## Site Settings

Global configuration includes:

* Currency exchange rate
* Social media links
* Advertisement configuration
* Homepage banner placements
* Sidebar banner placements

---

## Contact & Advertising

Messages submitted through the following forms are managed directly within the admin dashboard:

* Contact Us
* Advertise With Us

The platform also includes a simple inbox for reviewing inquiries.

---

# Public Website

## Homepage

The homepage showcases:

* Featured phones
* Price-based collections
* Latest devices
* News
* Deals and offers

Each price category links to its own dedicated listing page.

---

## SEO

Every public page is optimized for search engines with:

* Structured data (JSON-LD)
* Canonical URLs
* Open Graph metadata
* Social sharing previews

The platform also automatically generates:

* Sitemap
* robots.txt

Newly published content is submitted directly to Google, Bing, and Yandex for faster indexing.

---

## Advertising

Advertising is integrated in a performance-conscious manner.

Features include:

* Google AdSense support
* Lazy-loaded advertisement units
* Ads displayed only after valid slot IDs have been configured
* No intrusive popups or interstitial advertisements

In addition to programmatic advertising, the platform provides:

* **Advertise With Us** page
* Media Kit page
* Dedicated Deals & Offers section for local businesses and affiliate partners

---

# Pakistan-Focused Experience

MobileWala is built specifically for users in Pakistan.

The platform includes:

* PKR-first pricing
* PTA/DIRBS registration guidance
* IMEI verification information
* Localized categories and search patterns tailored to how Pakistani consumers research and compare smartphones

---

# Technology Stack

## Frontend

* Next.js 16 (App Router)
* React 19
* Turbopack
* React Compiler
* Tailwind CSS v4

---

## Backend & Database

* Supabase

  * PostgreSQL
  * Authentication
  * Row Level Security (RLS)
* Publishable/Secret Key authentication model

---

## Media Management

Images are hosted on **Cloudinary**, where they are automatically resized, optimized, and delivered in the appropriate format for each device and page.

---

## Forms & Validation

All public and administrative forms use:

* react-hook-form
* Zod

This ensures consistent validation across the entire application.

---

## Rich Text Editing

Phone descriptions and specification tables are built with **Tiptap**.

To maintain security, all editor content is sanitized using **DOMPurify** during both storage and rendering, preventing unsafe HTML from reaching the public site.

---

## Search Engine Optimization

The application includes extensive SEO support:

* JSON-LD structured data
* Product schema
* Article schema
* Breadcrumb schema
* Collection schema
* Automatic sitemap generation
* Automatic robots.txt generation
* Automatic indexing notifications for Bing and Yandex

---

## Performance

Performance optimizations include:

* Lazy-loaded advertisements
* Automatic image optimization
* Server-side rendering
* Modern React Compiler optimizations
* Turbopack-based development builds

---

## Deployment

* Vercel
* pnpm
