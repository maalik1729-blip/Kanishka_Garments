# System Documentation: Product Detail & RFQ Modal System

## Overview
The Product Detail Page (`/products/$slug`) provides a comprehensive B2B specification sheet and interactive Request For Quote (RFQ) modal system tailored for wholesale garment buyers, apparel brands, and fabric sourcing agents.

---

## Key Files & Components
- [`src/routes/products.$slug.tsx`](file:///c:/Users/Admin/OneDrive/Desktop/textile-trade-hub-main/src/routes/products.$slug.tsx) *(Product Details view, Spec Sheet, Tiered Pricing & RFQ Modal)*

---

## Features & Implementation Details

### 1. Specification Sheet (Tech Pack Display)
- Detailed B2B technical parameters table:
  - Fabric Weight (GSM) & Composition
  - Yarn Count & Loop Knit structure
  - Color fastness rating & Shrinkage tolerance
  - Packaging format & Mill origin (Tirupur, India)

### 2. Tiered Wholesale Pricing Calculator
- Real-time price per piece/meter calculation based on ordered volume tiers.
- MOQ (Minimum Order Quantity) enforcement.

### 3. Interactive RFQ (Request For Quote) Builder
- Modal form for submitting customized bulk quotes:
  - Custom GSM / color requests
  - Logo printing & custom label branding options
  - Delivery timelines and destination port selections

### 4. Interactive Image Gallery & Color Selection
- High-res main preview with multi-angle image switching.
- Dynamic color swatch selector updating product image and stock state.
