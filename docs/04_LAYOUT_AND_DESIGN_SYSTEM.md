# System Documentation: Layout, Design System & Styling

## Overview

Comprehensive guide to the visual aesthetics, typography, color palettes, and global layout system powering the website.

---

## Design Tokens & Styling Architecture

### 1. Typography System

- **Primary Font**: Favorit / Inter Sans-Serif font family (`font-favorit`)
- **Hierarchy**:
  - Main Headlines: `uppercase font-bold tracking-tight text-[32px] sm:text-[44px] lg:text-[50px]`
  - Section Headers: `text-[20px] font-bold tracking-tight uppercase`
  - Body & Specs: `text-[13px]` and `text-[14px]` neutral tones (`text-neutral-700`)

### 2. Color Palette

- **Monochrome Foundation**:
  - Off-White Canvas background: `#f0efe7`
  - High-Contrast Black: `#000000` (used for primary buttons, borders, and main titles)
  - Pure White: `#ffffff` (card backgrounds and elevated cards)
  - Tonal Grays: `#e5e7eb`, `#677284`, `#171717`

### 3. Layout Grid & Containers

- `max-w-[1440px]` max-width wrapper with responsive horizontal padding (`px-6 lg:px-12`).
- Tailwind CSS v4 grid system (`grid-cols-1 md:grid-cols-2 lg:grid-cols-12`).

### 4. Global Styles & Reset

- [`src/styles.css`](file:///c:/Users/Admin/OneDrive/Desktop/textile-trade-hub-main/src/styles.css)
  - Custom scrollbar rules
  - Utility helper classes for custom buttons (`btn-filled-add`)
  - Selection colors (`selection:bg-black selection:text-white`)
