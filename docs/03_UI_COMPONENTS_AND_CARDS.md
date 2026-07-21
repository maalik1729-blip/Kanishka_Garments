# System Documentation: UI Components, Buttons & Layout Elements

## Overview

Detailed breakdown of modular frontend components, navigation layouts, product cards, interactive buttons, and slide-over panels used across the application.

---

## Component Architecture

### 1. Product Card Component

- [`src/components/product-card.tsx`](file:///c:/Users/Admin/OneDrive/Desktop/textile-trade-hub-main/src/components/product-card.tsx)
- Reusable product card with:
  - `rounded-2xl` smooth container border radius
  - `rounded-xl` image thumbnail container
  - Interactive circular color swatches (`rounded-full`)
  - B2B Badges ("BESTSELLER", "GSM", "AQL 2.5 INSPECTED")
  - CTA Button ("SPECS & RFQ") with rounded corners (`rounded-lg`)

### 2. Navigation Header & Navbar

- [`src/components/layout/site-header.tsx`](file:///c:/Users/Admin/OneDrive/Desktop/textile-trade-hub-main/src/components/layout/site-header.tsx)
- Sticky top header containing:
  - Brand Logo ("KANISHKA GARMENTS")
  - Navigation links: Shop, Wholesale, About, Contact
  - Utility actions: Search bar trigger, Account link, Slide-out Cart trigger with badge counter

### 3. Footer Section

- [`src/components/layout/site-footer.tsx`](file:///c:/Users/Admin/OneDrive/Desktop/textile-trade-hub-main/src/components/layout/site-footer.tsx)
- Full-width editorial footer with brand vision, mill address (Tirupur), quick links, newsletter signup, and copyright notice.

### 4. Wholesale Cart Drawer / Sheet

- [`src/components/cart/cart-sheet.tsx`](file:///c:/Users/Admin/OneDrive/Desktop/textile-trade-hub-main/src/components/cart/cart-sheet.tsx)
- Slide-over drawer displaying selected sample items, quantity controls, estimated total cost in INR (`₹`), and proceed to RFQ checkout button.
