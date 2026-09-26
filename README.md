# MÚRÀ

**Prepare yourself.** (Pronounced *moo-rah*.)

MÚRÀ is a global digital-product store for students: planners, trackers, templates, kits and bundles that bring clarity to academic life, university life and the opportunities ahead. The website is the storefront — browse, understand, buy (or claim free), and receive files by email. No accounts, no subscriptions.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Framer Motion · Radix / shadcn conventions · Lucide · next-themes · React Hook Form + Zod · TanStack Query · Nodemailer · Vitest · Geist

## Run it

```bash
npm install
cp .env.example .env.local   # then fill in
npm run dev                  # http://localhost:3000
npm test                     # unit + delivery tests
npm run typecheck
npm run build && npm start   # production
```

## Hosting: Netlify

MÚRÀ is deployed on **Netlify** with its official Next.js runtime (`netlify.toml`). Server code runs as Netlify Functions, and because functions have no permanent disk, **orders and private product files live in Netlify Blobs** (detected automatically; `MURA_STORAGE=netlify-blobs` forces it). Locally, the same code uses the `.data/` and `private/` folders.

**Deploy**
1. Netlify → Add new site → Import from GitHub → `ema-love/mura` (branch of your choice). Build settings come from `netlify.toml`.
2. Site configuration → Environment variables: add everything marked in `.env.example` — at minimum `DOWNLOAD_TOKEN_SECRET`, `SMTP_USER`, `SMTP_PASS`, `EMAIL_FROM`, `MURA_INBOX_EMAIL`.
3. Upload product files (private): `NETLIFY_SITE_ID=… NETLIFY_AUTH_TOKEN=… npm run upload-file -- student-reset/mura-student-reset.pdf ./mura-student-reset.pdf`
4. See orders any time: `NETLIFY_SITE_ID=… NETLIFY_AUTH_TOKEN=… npm run orders`

Static-only or PHP-only hosting (such as InfinityFree) cannot run this site.

## Everyday tasks

### Set a price or launch a product
Everything lives in `lib/catalog/products.ts`.

- **Price:** `pricing: { model: "paid", amount: 900 }` — amounts are **US cents** (900 = $9), exactly as in the approved master catalogue. Never include payment-provider charges.
- **Status:** `draft` (hidden) → `published` (live) → `archived` (hidden, past orders still work). Only the owner decides when a product is published.
- **Featured:** `featured: true` puts it on the homepage.
- **Photography:** add `image.src` (a file in `/public`) to replace the composed artwork. Until then, a clearly marked placeholder shows the art direction.

### Upload a template (several formats)
Customers choose on their download page: download a PDF, Excel or Word file, or "Make a copy" in Google Docs / Google Sheets. Set a product up in one command:

```bash
NETLIFY_SITE_ID=… NETLIFY_AUTH_TOKEN=… npm run set-template -- student-reset \
  --pdf ./Student-Reset.pdf --excel ./Student-Reset.xlsx \
  --docs "https://docs.google.com/document/d/…/edit?usp=sharing" \
  --sheets "https://docs.google.com/spreadsheets/d/…/edit?usp=sharing"
```

Use any of `--pdf`, `--excel`, `--word`, `--docs`, `--sheets`. Share each Google file as "Anyone with the link → Viewer" first; the script turns the link into a "make a copy" link. The copy links are stored privately with the files and only appear behind a valid download link. Running it again replaces the set. Add `--local` to write to `PRODUCT_FILES_DIR` for local testing.

A product can instead have one file at its `fileKey`, uploaded with `npm run upload-file -- <fileKey> <path>`. Files are private and never live in `/public` or in git. A product with nothing uploaded can't be claimed or bought — the site says so honestly instead of sending a broken link.

### Email (Gmail)
1. Turn on 2-Step Verification for the Gmail account.
2. Create an **App Password** (Google Account → Security → App passwords).
3. Set `SMTP_USER` to the address, `SMTP_PASS` to the app password, `EMAIL_FROM` to e.g. `MÚRÀ <address@gmail.com>`, and `MURA_INBOX_EMAIL` to the company inbox.

Without SMTP, development writes emails to `.data/outbox/` so you can test; production refuses to pretend an email was sent. Gmail has daily sending limits — move to a dedicated provider (any SMTP service) as volume grows; only the `SMTP_*` values change.

### Seasons and campaigns
- **Season:** `NEXT_PUBLIC_SEASON=default | valentines | easter | back-to-school | christmas` (rebuild/redeploy to apply). Seasons recolour the accent and add a quiet mark and hero line — defined in `lib/season/seasons.ts`.
- **Campaign discounts:** defined in `lib/season/campaigns.ts` with honest start and end dates. Switch one on with `enabled: true` or `NEXT_PUBLIC_ACTIVE_CAMPAIGN=<id>`. Prices everywhere update; pages refresh hourly so campaigns start and stop on their dates. No countdown timers. The banner only appears when the discount applies to something purchasable.

## Architecture

```
app/
  page.tsx                    Storefront homepage (story order)
  systems/                    Store: search + filters in the URL
  collections/, [slug]        Curated category pages
  products/[slug]             Product pages (+ JSON-LD, OG image)
  resources/, [slug]          Editorial guides (+ Article JSON-LD, OG image)
  pin/[kind]/[slug]           2:3 Pinterest images
  access/                     "Sign in" without accounts — emails fresh download links
  about/                      Brand + contact form
  downloads/[token]           Branded download page
  api/claim                   Free-product claim → order → email
  api/download/[token]        Verified, private file streaming
  api/access, api/contact     Link resend, contact form
  checkout/[slug], complete   Checkout and verified payment result
  api/checkout                Starts a Flutterwave payment
  api/payments/flutterwave/webhook   Verified payment webhook
  sitemap.ts, robots.ts, opengraph-image.tsx, error.tsx, global-error.tsx, not-found.tsx
components/
  store/                      ProductCard/Grid, BundleCard, PriceDisplay, CheckoutButton, ProductArt, badges
  product/                    PurchasePanel, ClaimForm, FAQ, mobile buy bar
  previews/                   Product interface previews (sample data)
  resources/                  ResourceCard, browser, Pinterest share row
  sections/                   Homepage chapters
  scene/                      Hand-drawn SVG desk (parallax + scroll assembly)
  site/                       Nav, search (⌘K), footer, forms, seasonal theme, campaign banner
lib/
  catalog/                    Product/category model, catalogue data, queries
  commerce/                   Pricing (campaigns), money, order model, payment switch
  season/                     Seasons and campaigns
  server/                     server-only: env, orders, tokens, files, email, fulfilment, rate limits
  data/resources.ts           Guides
```

### Orders
`lib/server/order-store.ts` defines an `OrderStore` interface with two implementations: Netlify Blobs (`blob-order-store.ts` — ETag-safe updates, unique references, hashed email index) in production, and a file store (`.data/orders.json`) locally. No card details are ever stored.

Form rate limits are kept in memory per function instance — enough to stop casual abuse; move them to a shared store if traffic grows.

### Delivery security
Download links carry an HMAC-signed token (order, product, expiry) — never a file path. Each download re-checks the signature, expiry, that the order is free or verified-paid, that the product belongs to it, that the file exists, and a per-order download allowance. Files stream from a private directory with `no-store` and `noindex` headers.

## Payments (Flutterwave)
Checkout uses Flutterwave v3 hosted payments. Card details never touch MÚRÀ.

1. `/checkout/<slug>` — the customer enters an email. `POST /api/checkout` creates a `pending` order at the catalogue price (after any active campaign) with a unique reference, and returns a Flutterwave payment link. Products whose file isn't uploaded can't be bought.
2. Flutterwave returns the customer to `/checkout/complete`. The server verifies the transaction with Flutterwave's API — status, reference, currency and amount — and never trusts the redirect's own status. Only then is the order marked `paid` and `fulfilOrder()` emails the download.
3. `POST /api/payments/flutterwave/webhook` (checked against `FLW_SECRET_HASH`) does the same verification, so a customer who closes the tab still receives their files. Both paths are idempotent: an order is marked paid once and emailed once.

**Payment charges.** Prices are never marked up. Set *Flutterwave dashboard → Settings → Account settings → "Make customers pay the transaction fees"* (wording may vary) and Flutterwave adds its charge on the payment page. The amount actually charged and the charge itself are recorded on the order.

**Set up (test mode)**
1. Netlify environment variables: `FLW_SECRET_KEY` (FLWSECK_TEST-…, mark as secret), `FLW_SECRET_HASH` (secret), `FLW_MODE=test`, `NEXT_PUBLIC_PAYMENTS_ENABLED=true`. Redeploy.
2. Flutterwave → Settings → Webhooks: URL `https://mura-digitals.netlify.app/api/payments/flutterwave/webhook`, same secret hash. Tick the charge-completed events.
3. Buy with a Flutterwave test card. Check the order with `npm run orders`.

**Going live** — only when the owner decides: swap in the live secret key, set `FLW_MODE=live`, add the live webhook, redeploy.
