# Baxtli Men Brand Identity Guide

This guide ensures a consistent "wellness concierge" aesthetic across all platform touchpoints.

## Core Aesthetic: Monochrome Premium
The brand identity is built on a clean, high-contrast monochrome palette. It avoids generic colors in favor of deep blacks, pure whites, and subtle beige accents.

### Color Palette (from `globals.css`)
- **Primary/Foreground (`--bm-fg`)**: `#000000` (Pure Black for typography and primary actions).
- **Background (`--bm-bg`)**: `#FFFFFF` (Pure White for airy, clean spaces).
- **Surface (`--bm-surface`)**: `#F9F9F9` (Subtle gray for cards and section backgrounds).
- **Accent Beige (`--bm-accent-beige`)**: `#F5F5DC` (Warm beige for gentle highlights).
- **Border (`--bm-border`)**: `#EEEEEE` (Faint lines to maintain structure without visual clutter).

---

## Typography
We use a two-font system to balance modern professionalism with personal wellness.

1.  **Inter (Sans-Serif)**:
    *   Used for all UI elements, body text, and headings.
    *   **Style**: Bold/Black for headings (`tracking-tighter`), Light/Medium for body.
2.  **Allura (Cursive Signature)**:
    *   Used for the "by Sabina Polatova" signature and decorative quotes.
    *   **CSS Class**: `.bm-signature`

---

## UI Components (`src/components/ui-bm`)
Use these components to maintain the "concierge" look:

| Component | Usage | Aesthetic Notes |
| :--- | :--- | :--- |
| `Logo` | Brand presence | Includes the "by Sabina Polatova" signature. |
| `Button` | Primary/Secondary actions | Sharp `rounded-bm` (16px), monochrome colors. |
| `Card` | Content containers | Light shadow (`shadow-soft`), airy padding. |
| `Badge` | Labels/Status | Uppercase, `tracking-widest`, minimalist. |
| `TrainerHero` | Introduction sections | Large typography, premium image handling. |
| `CourseCard` | Product listings | Monochrome, grayscale images (hover to color). |

---

## Visual Rules
1.  **Airy Spacing**: Use generous `px-6` (mobile) or `px-10` (desktop) and `space-y-12`.
2.  **Tracking**: Use `tracking-widest` for small uppercase labels and `tracking-tighter` for large headings.
3.  **Grayscale**: Prefer grayscale images for a high-end editorial feel.
4.  **Shadows**: Use `shadow-soft` (very subtle) or `shadow-2xl` (for floating buttons) sparingly.

---

*Baxtli Men — Elevating the Yoga Experience via Monochrome Elegance.*
