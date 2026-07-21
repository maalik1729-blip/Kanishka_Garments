# System Documentation: Admin Panel & Product Management

## Overview

The Admin Panel is a full-featured B2B administration dashboard built into the application. It allows administrators to create, edit, delete, and manage catalog products, fabric specifications, wholesale tier pricing, and orders without needing an external database.

---

## Key Files & Entry Points

- [`src/routes/admin.tsx`](file:///c:/Users/Admin/OneDrive/Desktop/textile-trade-hub-main/src/routes/admin.tsx) _(Main Admin Dashboard & CRUD state manager)_
- [`src/lib/products.ts`](file:///c:/Users/Admin/OneDrive/Desktop/textile-trade-hub-main/src/lib/products.ts) _(Product data structure, helper methods, & local storage persistence)_

---

## Features & Capabilities

### 1. Product Management (CRUD)

- **Create Product**: Add new apparel or raw knit fabric items with detailed specs:
  - Product Name, Slug, Category, and Subtype
  - GSM (Grams per Square Meter), Composition (e.g. 100% Combed Cotton), Yarn Count
  - Wholesale Price, Retail Price, and Minimum Order Quantity (MOQ)
  - Color Swatches (Name + Hex codes)
  - Technical Specs Table (Gauge, Shrinkage, Dyeing method, Lead time)
- **Edit Product**: Inline editing modal/drawer to update pricing, stock status, or spec sheets.
- **Delete Product**: Safe soft/hard removal of catalog items with state update triggers.

### 2. Local Storage & Event Synchronization

- Admin created/edited products are stored in browser `localStorage` under `kanishka_custom_products`.
- Custom event dispatcher `kanishka_products_updated` notifies open catalog tabs in real-time.

### 3. Order & Inquiry Tracking

- Inquiry dashboard for viewing submitted B2B Request For Quote (RFQ) forms.
- Status filters (Pending, Reviewed, Processing, Fulfilled).

### 4. Security & Access Control

- Simple passkey authentication mechanism protecting administrative routes.
