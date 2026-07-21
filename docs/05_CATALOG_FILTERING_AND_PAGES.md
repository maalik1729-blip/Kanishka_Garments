# System Documentation: Pages, Catalog Filtering & Routing

## Overview

Overview of application routes, TanStack Router setup, catalog search/filter logic, and static content pages.

---

## Route Overview & Page Structure

### 1. Homepage (`/`)

- [`src/routes/index.tsx`](file:///c:/Users/Admin/OneDrive/Desktop/textile-trade-hub-main/src/routes/index.tsx)
- Contains:
  - Hero Section poster design with updated model image asset (`src/assets/hero.png`)
  - Interactive collection tabs (`ALL`, `ACTIVEWEAR`, `HOODIES`, `LADIES WEAR`, `GENTS WEAR`, `COTTON FABRICS`)
  - Featured product showcase grid
  - Mill capabilities banner

### 2. Catalog & Lookbook (`/products`)

- [`src/routes/products.index.tsx`](file:///c:/Users/Admin/OneDrive/Desktop/textile-trade-hub-main/src/routes/products.index.tsx)
- Features:
  - Real-time search query filtering (`q` search param)
  - Category tab filtering (`c` category param)
  - Price range selector filters (Under ₹150 up to Above ₹1,200)
  - Readymade vs. Fabric Roll toggle filter

### 3. Wholesale Manufacturing Page (`/wholesale`)

- [`src/routes/wholesale.tsx`](file:///c:/Users/Admin/OneDrive/Desktop/textile-trade-hub-main/src/routes/wholesale.tsx)
- Details private label OEM services, yarn spinning capabilities, minimum order quantities, and bulk RFQ intake form.

### 4. About Us & Contact Pages

- [`src/routes/about.tsx`](file:///c:/Users/Admin/OneDrive/Desktop/textile-trade-hub-main/src/routes/about.tsx) - Heritage, Tirupur textile hub origins, factory specs.
- [`src/routes/contact.tsx`](file:///c:/Users/Admin/OneDrive/Desktop/textile-trade-hub-main/src/routes/contact.tsx) - Mill address, phone numbers, Google Maps embed, inquiry form.
- [`src/routes/sitemap[.]xml.ts`](file:///c:/Users/Admin/OneDrive/Desktop/textile-trade-hub-main/src/routes/sitemap[.]xml.ts) - Dynamic XML sitemap generator for SEO.
