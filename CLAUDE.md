# CLAUDE.md — Complete Codebase Architecture & Change Log

This file serves as the unified master reference for **Kanishka Garments** — an editorial B2B apparel lookbook, wholesale fabric catalog, and custom private label manufacturing platform.

---

## 🛠️ Commands & Operations

| Action                       | Command                                                          |
| :--------------------------- | :--------------------------------------------------------------- |
| **Start Development Server** | `npm run dev` (Runs Vite dev server on `http://localhost:8080/`) |
| **Production Build**         | `npm run build`                                                  |
| **Preview Build**            | `npm run preview`                                                |
| **Lint Codebase**            | `npm run lint`                                                   |
| **Format Files**             | `npm run format`                                                 |

---

## 📂 Project Architecture & Directory Map

```
textile-trade-hub-main/
├── CLAUDE.md                          # Unified master codebase guide & changelog
├── DOCUMENTATION_INDEX.md             # Index pointing to separate feature markdown docs
├── CHANGELOG_PRODUCT_CARD_BORDER_RADIUS.md
├── CHANGELOG_HERO_IMAGE_REPLACEMENT.md
├── CHANGELOG_GIT_PUSH_DEPLOYMENT.md
├── docs/
│   ├── README.md                      # Documentation index
│   ├── 01_ADMIN_PANEL_SYSTEM.md       # Admin panel & CRUD operations doc
│   ├── 02_PRODUCT_DETAILS_AND_RFQ.md  # Product details & RFQ modal doc
│   ├── 03_UI_COMPONENTS_AND_CARDS.md  # Components, buttons, & drawer doc
│   ├── 04_LAYOUT_AND_DESIGN_SYSTEM.md # Layout, typography & design system doc
│   └── 05_CATALOG_FILTERING_AND_PAGES.md # Catalog routing & search filter doc
├── public/                            # Static public assets
└── src/
    ├── assets/                        # High-resolution image assets (hero.png, product images)
    ├── components/
    │   ├── cart/
    │   │   └── cart-sheet.tsx         # Slide-over wholesale cart drawer
    │   ├── layout/
    │   │   ├── site-header.tsx        # Sticky navigation header & search bar
    │   │   └── site-footer.tsx        # Editorial footer with Tirupur mill contact info
    │   ├── ui/                        # UI primitives (accordion, dialog, dropdown, etc.)
    │   └── product-card.tsx           # Rounded-corner product card component
    ├── lib/
    │   ├── cart.ts                    # Cart state & INR currency formatting helpers
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

### 4. Product Detail & RFQ Modal System (`src/routes/products.$slug.tsx`)

- Detailed B2B Tech Pack specification table (GSM, Shrinkage rating, Dyeing specs, Mill origin).
- Volume tier pricing calculator automatically adjusting bulk cost based on MOQ.
- Custom Request For Quote (RFQ) modal form allowing buyers to request custom colors, GSM, or private label branding.
- **Escape Key Keyboard Navigation**: Pressing `Escape` (`Esc`) key closes any active modal (RFQ modal, 3D preview, fabric zoom); if no modal is open, it returns to the previous page in history (or defaults back to `/products`).
- **Interactive Mouse-Tracking Pan/Zoom Lens**: Moving the cursor across the product image dynamically updates `transformOrigin` (`${zoomPos.x}% ${zoomPos.y}%`) and scales the image up to 2.8x in real-time with an ultra-smooth slow motion transition (`0.75s cubic-bezier(0.16, 1, 0.3, 1)`), allowing buyers to smoothly inspect any exact spot on the T-shirt (neckline, collar, sleeves, chest, stitching, hem).
- **Background Body Scroll Lock**: Automatically sets `document.body.style.overflow = "hidden"` while any modal (Fabric Zoom, RFQ Form, 3D Drape Viewer) is active, preventing background page scrolling. Restores normal scrolling when modals close.
- **Thumbnail Image Click Zoom Trigger**: Clicking any small thumbnail square (`#1`, `#2`, `#3`, etc.) updates the active product photo and opens the high-resolution Fabric Weave Close-Up Modal with interactive mouse-tracking magnification lens.
- **Streamlined Image Overlay**: Removed the 360° Drape & Movement button to focus clean visual attention on high-resolution Fabric Weave Close-Up (`FABRIC WEAVE CLOSE-UP (ZOOM)`).

### 5. Catalog Search, Filtering & Lookbook (`src/routes/products.index.tsx`)

- Real-time text search filter (`q` query param).
- Category tabs (`c`), Subtype selector (`type`), and Price Range filter (`min` / `max`).
- Readymade apparel vs. Raw fabric roll toggle filter (`rm`).

### 6. Navigation Header, Footer & Cart Drawer

- **Header** ([`src/components/layout/site-header.tsx`](file:///c:/Users/Admin/OneDrive/Desktop/textile-trade-hub-main/src/components/layout/site-header.tsx)): Sticky header with brand logo, nav links, quick search, and active cart counter.
- **Footer** ([`src/components/layout/site-footer.tsx`](file:///c:/Users/Admin/OneDrive/Desktop/textile-trade-hub-main/src/components/layout/site-footer.tsx)): Full-width footer with Tirupur mill address, company links, newsletter input, and legal notices.
- **Cart Sheet** ([`src/components/cart/cart-sheet.tsx`](file:///c:/Users/Admin/OneDrive/Desktop/textile-trade-hub-main/src/components/cart/cart-sheet.tsx)): Slide-over drawer managing wholesale sample items, quantities, INR (`₹`) total, and checkout triggers.

### 7. Version Control & Git History

- Staged, committed, and pushed to remote GitHub repository: `https://github.com/maalik1729-blip/Kanishka_Garments.git` on branch `main`.

---

## ⚡ Core Functions & Utilities Reference

### 1. `src/lib/products.ts`

- `getAdminProducts()`: Retrieves admin-created products stored in browser `localStorage` under key `kanishka_custom_products`.
- `saveAdminProducts(products: Product[])`: Saves updated custom product list to `localStorage` and dispatches `kanishka_products_updated` window event.
- `deleteAdminProduct(id: string)`: Removes custom product by ID from `localStorage` and triggers sync update.
- `getProductBySlug(slug: string)`: Searches combined static catalog (`staticProducts`) and admin products to return matching `Product`.

### 2. `src/lib/cart.ts`

- `formatINR(amount: number)`: Formats numeric currency into Indian Rupee string (`₹1,250`).
- `getCart()`, `saveCart(cart: CartItem[])`: LocalStorage state management for wholesale sample cart items.
- `addToCart(product: Product, quantity: number, color?: string)`: Appends item or updates existing quantity in cart.
- `removeFromCart(id: string)`: Deletes specified cart line item.

### 3. `src/routes/admin.tsx`

- `handleCreateProduct(formData)`: Validates and persists new product record into custom catalog.
- `handleUpdateProduct(id, formData)`: Updates existing product specifications and dispatches live update event.
- `handleDeleteProduct(id)`: Triggers product deletion with confirmation dialog.

- `ProductCard({ product }: { product: Product })`: Renders interactive product card with rounded corners, color swatches, B2B badges, and RFQ trigger button.

### 5. `vite.config.ts` & `vercel.json` (Deployment & Build System)

- **Standard Vite Plugins**: Configured with `@vitejs/plugin-react`, `@tailwindcss/vite`, and `@tanstack/react-start/plugin/vite` — 100% independent of external `@lovable.dev` wrappers.
- **Vercel Build Target**: `outputDirectory: "dist/client"` configured in `vercel.json` for fast, native SPA/SSR deployments on Vercel.
