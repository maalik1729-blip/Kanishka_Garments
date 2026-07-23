# CLAUDE.md — Complete Codebase Architecture & Change Log

This file serves as the unified master reference for **TM KANISHKA GARMENTS** — an editorial B2B apparel lookbook, wholesale fabric catalog, and custom private label manufacturing platform based in Tirupur, India.

- **Company Name**: TM KANISHKA GARMENTS
- **Address**: D.No.2/95A-3, Shop D S & S Complex, HRHK Nagar, S.R.Nagar South, Andipalayam Pirivu, TIRUPPUR - 641687
- **Direct Cell / WhatsApp**: +91 87540 11563
- **GSTIN**: 33CNRPT6310G1ZS
- **Email**: tmkanishkagarments@gmail.com
- **Bank Details**: State Bank of India | A/C: 43605722884 | IFSC: SBIN0000935 | Branch: Tirupur Main Branch

---

## 🛠️ Commands & Operations

| Action                       | Command                                                          |
| :--------------------------- | :--------------------------------------------------------------- |
| **Start Development Server** | `npm run dev` (Runs Vite dev server on `http://localhost:8080/`) |
| **Production Build**         | `npm run build`                                                  |
| **Preview Build**            | `npm run preview`                                                |
| **Lint Codebase**            | `npm run lint`                                                   |
| **Format Files**             | `npm run format`                                                 |

### 🔐 Environment Variables (`.env`)

- `MONGODB_URI`: Connection string for MongoDB Atlas cluster database.
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`: Credentials for Cloudinary media asset uploads & CDN delivery.

---

## 📂 Project Architecture & Directory Map

```
textile-trade-hub-main/
├── CLAUDE.md                          # Unified master codebase guide & changelog
├── docs/
│   ├── README.md                      # Documentation index
│   ├── DOCUMENTATION_INDEX.md         # Index pointing to separate feature markdown docs
│   ├── CHANGELOG_PRODUCT_CARD_BORDER_RADIUS.md
│   ├── CHANGELOG_HERO_IMAGE_REPLACEMENT.md
│   ├── CHANGELOG_GIT_PUSH_DEPLOYMENT.md
│   ├── top_10_tiruppur_textile_products.md # Top textile products reference list
│   ├── 01_ADMIN_PANEL_SYSTEM.md       # Admin panel & CRUD operations doc
│   ├── 02_PRODUCT_DETAILS_AND_RFQ.md  # Product details & RFQ modal doc
│   ├── 03_UI_COMPONENTS_AND_CARDS.md  # Components, buttons, & drawer doc
│   ├── 04_LAYOUT_AND_DESIGN_SYSTEM.md # Layout, typography & design system doc
│   └── 05_CATALOG_FILTERING_AND_PAGES.md # Catalog routing & search filter doc
├── public/                            # Static public assets
└── src/
    ├── assets/                        # High-resolution image assets (hero.png, product images)
    ├── components/
    │   ├── layout/
    │   │   ├── site-header.tsx        # Sticky navigation header & search bar
    │   │   └── site-footer.tsx        # Editorial footer with Tirupur mill contact info
    │   ├── ui/                        # UI primitives (button.tsx, chat-widget.tsx, sheet.tsx)
    │   └── product-card.tsx           # Rounded-corner product card component
    ├── lib/
    │   └── products.ts                # Static catalog, product type definitions & LocalStorage state
    ├── routes/
    │   ├── __root.tsx                 # Root layout wrapper with SiteHeader and SiteFooter
    │   ├── index.tsx                  # Homepage poster hero layout & category tabs
    │   ├── admin.tsx                  # B2B Admin dashboard & product management panel
    │   ├── products.index.tsx         # Catalog lookbook with search, category & price filters
    │   ├── products.$slug.tsx         # Product detail page, tech specs & RFQ modal
    │   ├── products.tsx               # Product parent outlet
    │   ├── wholesale.tsx              # Private label OEM manufacturing service overview
    │   ├── about.tsx                  # Mill heritage & factory infrastructure
    │   ├── contact.tsx                # Tirupur facility location & inquiry form
    │   └── sitemap[.]xml.ts           # Dynamic XML sitemap generator
    ├── styles.css                     # Global styles, Tailwind v4 imports, custom scrollbar & classes
    └── router.tsx                     # TanStack Router configuration
```

---

## 🎨 Design System & Visual Aesthetics

- **Typography**: Favorit / Inter Sans-Serif font family (`font-favorit`). Heavy uppercase headlines with tight tracking (`tracking-tight`).
- **Color Palette**:
  - Background Canvas: Off-white `#f0efe7`
  - High-Contrast Black: `#000000` (buttons, borders, primary titles)
  - Pure White: `#ffffff` (card backgrounds)
  - Tonal Grays: `#e5e7eb`, `#677284`, `#171717`
- **Border Radius Standards**:
  - Main Product Cards: `rounded-2xl`
  - Thumbnail Wrapper: `rounded-xl`
  - Badges & Pills: `rounded-md`
  - Swatch Circles: `rounded-full`
  - Action Buttons: `rounded-lg`

---

## 📝 Detailed Summary of All Changes

### 1. Product Card Component Refactoring (`src/components/product-card.tsx`)

- **Container**: Transformed hard square card to `rounded-2xl` with smooth border transitions (`hover:border-black/30 hover:shadow-lg`).
- **Thumbnail & Badges**: Added `rounded-xl` to thumbnail frame and image. Updated overlay pills ("BESTSELLER", "GSM", "AQL 2.5 INSPECTED") with `rounded-md` and `rounded-b-xl`.
- **Swatches**: Switched swatch buttons from square to circular `rounded-full` with an active ring indicator (`ring-2 ring-black ring-offset-1`).
- **CTA Button**: Styled "SPECS & RFQ" button with `rounded-lg` rounded corners.

### 2. Homepage Hero Section Image & Copy Upgrade (`src/assets/hero.png` & `src/routes/index.tsx`)

- Replaced previous hero image with the new model photo wearing a yellow-and-black striped long-sleeve tee with sunglasses (`da753bec-2d15-44b1-bcf8-917db3ba779e (1).png`).
- Updated Hero poster copy to showcase **Garment Manufacturing, Custom OEM Production, Private Label Branding & Wholesale Textile Mill** capabilities direct from Tirupur, India.
- Added dual CTA action buttons: `VIEW CATALOG & SPECS` and `REQUEST BULK RFQ`.
- Maintained `mix-blend-multiply` against the `#f0efe7` canvas for background blending.

### 3. B2B Admin Panel Dashboard (`src/routes/admin.tsx`)

- Comprehensive admin interface featuring:
  - Product creation form (Name, Category, Subtype, Price, MOQ, GSM, Yarn Count, Composition, Swatches).
  - Edit & Delete product modal drawers.
  - Integration with `localStorage` (`kanishka_custom_products`) and real-time custom event triggers (`kanishka_products_updated`).
  - Inquiry & RFQ order submission tracking dashboard.
  - **Yes/No Delete Confirmation**: Native window confirmation alerts protect product and RFQ quote list deletion from accidental clicks.
  - **Auto-Logout Session Protection**: Automatically signs out of the Admin panel if the user remains inactive. Idle threshold is custom-adjustable via the **Security & Access** tab settings.
  - **ConfirmExitModal Layout Optimization**: Exit modal buttons stack vertically (`flex-col w-full`) to prevent right-side layout overflow.
  - **Product Listing Deduplication**: Integrates unique slug mapping (`getAllProducts()`) to merge local static catalogue with dynamic MongoDB Atlas products, ensuring no duplicates.

### 4. Product Detail & RFQ Modal System (`src/routes/products.$slug.tsx`)

- Detailed B2B Tech Pack specification table (GSM, Shrinkage rating, Dyeing specs, Mill origin).
- Volume tier pricing calculator automatically adjusting bulk cost based on MOQ.
- Custom Request For Quote (RFQ) modal form allowing buyers to request custom colors, GSM, or private label branding.
- **MongoDB Atlas Global Bulk RFQ & Inquiry Integration**: All RFQ quote submissions and inquiries across **ALL product detail pages** (`/products/$slug`), **Wholesale page** (`/wholesale`), and **Contact page** (`/contact`) post directly to MongoDB Atlas via server handler `POST /api/quotes`. Submitted requests are immediately visible in the Admin Portal (`/admin`) Quote Requests dashboard, where status updates (_Pending → Contacted → Fulfilled_) and deletions sync live to MongoDB.
- **Dynamic Stock Colorway Photo Switcher**: Selecting any swatch in `STOCK COLORWAY:` (e.g. Hoodies: Forest Green (`#1B4D3E` / `p4.png`), Heather Grey, Navy Blue | Joggers & Track Pants: Heather Grey (`#D3D3D3` / `p5.png`), Dark Charcoal, Navy | Baby Onesies / Rompers: Orange (`#F26522` / `p8.png`), Sky Blue (`e9a8c112-8585-41e0-8d6f-57507bfa5ce3.png`), Baby Pink (`538bd947-361b-45f6-94d1-fa08d8160d6a.png`) | Single Jersey Fabric: Lavender (`#E6E6FA` / `p10.png`), White (`7b623247-291d-4ff9-a70a-9d48aa0fdcd1.png`), Navy Blue (`d7399407-a6fe-4798-8de2-f698b4e7cb7d.png`) | Men's Vests / Undershirts: White (`b6fba935-c1ad-4181-bcfe-1e6676862140.png`), Black (`ccacd5cf-5609-4aca-8e56-8ec55cf30ca1.png`) | Basic Tee: Chocolate Brown, White, Navy Blue, Melange Grey | Polo Tee: Slate Grey, Royal Blue, White, Charcoal | Oversized Tee: Olive Green, Off White, Beige, Sage Green | Gym Tees: Stealth Black, Navy, Cool Grey | Women's Leggings: Jet Black, Navy Blue, Maroon) instantly updates the main featured product photo on the left-side viewer to match the exact selected colorway.
- **Escape Key Keyboard Navigation**: Pressing `Escape` (`Esc`) key closes any active modal (RFQ modal, 3D preview, fabric zoom); if no modal is open, it returns to the previous page in history (or defaults back to `/products`).
- **Interactive Mouse-Tracking Pan/Zoom Lens**: Moving the cursor across the product image dynamically updates `transformOrigin` (`${zoomPos.x}% ${zoomPos.y}%`) and scales the image up to 2.8x in real-time with an ultra-smooth slow motion transition (`0.75s cubic-bezier(0.16, 1, 0.3, 1)`), allowing buyers to smoothly inspect any exact spot on the T-shirt (neckline, collar, sleeves, chest, stitching, hem).
- **Background Body Scroll Lock**: Automatically sets `document.body.style.overflow = "hidden"` while any modal (Fabric Zoom, RFQ Form, 3D Drape Viewer) is active, preventing background page scrolling. Restores normal scrolling when modals close.
- **Thumbnail Image Click Zoom Trigger**: Clicking any small thumbnail square (`#1`, `#2`, `#3`, etc.) updates the active product photo and opens the high-resolution Fabric Weave Close-Up Modal with interactive mouse-tracking magnification lens.
- **Streamlined Image Overlay**: Removed the 360° Drape & Movement button to focus clean visual attention on high-resolution Fabric Weave Close-Up (`FABRIC WEAVE CLOSE-UP (ZOOM)`).

### 5. Legal Compliance & Policy Pages (`src/routes/privacy.tsx` & `src/routes/terms.tsx`)

- **Privacy Policy Page** ([`src/routes/privacy.tsx`](file:///c:/Users/Admin/OneDrive/Desktop/textile-trade-hub-main/src/routes/privacy.tsx)): Covers B2B client data protection, tech pack NDA confidentiality, GSTIN tax data security, and direct contact email (`tmkanishkagarments@gmail.com`).
- **Terms of Service Page** ([`src/routes/terms.tsx`](file:///c:/Users/Admin/OneDrive/Desktop/textile-trade-hub-main/src/routes/terms.tsx)): Outlines official B2B wholesale MOQ conditions, SBI Bank remittance details (`A/C: 43605722884`, `IFSC: SBIN0000935`), GSM weight tolerance (±5%), and AQL 2.5 quality inspection standards.

### 6. Catalog Search, Filtering & Lookbook (`src/routes/products.index.tsx`)

- Real-time text search filter (`q` query param).
- Category tabs (`c`), Subtype selector (`type`), and Price Range filter (`min` / `max`).
- Readymade apparel vs. Raw fabric roll toggle filter (`rm`).

### 6. Navigation Header & Footer

- **Header** ([`src/components/layout/site-header.tsx`](file:///d:/ziya/Projects/TNVS/kanishka_garments/src/components/layout/site-header.tsx)): Sticky header with brand logo, nav links, and quick search.
- **Footer** ([`src/components/layout/site-footer.tsx`](file:///d:/ziya/Projects/TNVS/kanishka_garments/src/components/layout/site-footer.tsx)): Full-width footer with Tirupur mill address, company links, newsletter input, and legal notices. Refactored arbitrary Tailwind classes to standard theme utility classes (`bg-warm-fog`, `max-w-360`, `tracking-wide`).

### 7. Version Control & Git History

- Staged, committed, and pushed to remote GitHub repository: `https://github.com/maalik1729-blip/Kanishka_Garments.git` on branch `main`.

---

## ⚡ Core Functions & Utilities Reference

### 1. `src/lib/products.ts`

- `getAdminProducts()`: Retrieves admin-created products stored in browser `localStorage` under key `kanishka_custom_products`.
- `saveAdminProducts(products: Product[])`: Saves updated custom product list to `localStorage` and dispatches `kanishka_products_updated` window event.
- `deleteAdminProduct(id: string)`: Removes custom product by ID from `localStorage` and triggers sync update.
- `getProductBySlug(slug: string)`: Searches combined static catalog (`staticProducts`) and admin products to return matching `Product`.

### 2. `src/routes/admin.tsx`

- `handleCreateProduct(formData)`: Validates and persists new product record into custom catalog.
- `handleUpdateProduct(id, formData)`: Updates existing product specifications and dispatches live update event.
- `handleDeleteProduct(id)`: Triggers product deletion with confirmation dialog.

- `ProductCard({ product }: { product: Product })`: Renders interactive product card with rounded corners, color swatches, B2B badges, and RFQ trigger button.

### 5. `vite.config.ts` & `vercel.json` (Deployment & Build System)

- **Standard Vite Plugins**: Configured with `@vitejs/plugin-react`, `@tailwindcss/vite`, and `@tanstack/react-start/plugin/vite` — 100% independent of external `@lovable.dev` wrappers.
- **Vercel Build Target**: `outputDirectory: "dist/client"` configured in `vercel.json` for fast, native SPA/SSR deployments on Vercel.
