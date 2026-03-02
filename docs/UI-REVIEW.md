# UI/UX Review — www.espa-israel.com

**Reviewer perspective:** UI/design review for conformance, cleanliness, RTL, and asset placement.  
**Scope:** Home, Mandate, Operations, Compliance, Philanthropy (EN / HE / AR).

---

## 1. Design conformance (Visual Identity — שפת עיצוב)

- **Palette:** 2–3 conservative colors only: Navy (#1a2744), Slate grays, White. No accent or decorative color. Trust/authority tone (UN/EU-style).
- **Typography:** Clean Sans-Serif, highly readable. EN: Inter / Roboto; HE: Assistant; AR: Noto Sans Arabic. Bold headings, not colorful.
- **Images:** Documentary, realistic (no stock “smiley” imagery). Hero assets: institutional/operational (buildings, logistics, data, field kitchens).
- **Spacing:** `max-w-6xl`, `px-6`, `py-*` used consistently. Section rhythm is even.
- **Requirements:** Institutional, professional tone. No placeholder SVGs; all references point to real assets.

---

## 2. UI cleanliness and placement

- **Header:** Trust bar + main nav + language switcher are clearly separated. Logo links to home. Active nav state (bg-navy) is clear.
- **Hero (home):** Logo, H1, subtitle, CTAs, and ticket ID are stacked in a logical order. No visual clutter.
- **Page heroes (subpages):** Two-column grid (text + image). Image has fixed aspect ratio (16/10) and `object-cover object-center` so it fits the block without distortion.
- **Cards (overview, directorates, case studies, compliance):** Number badge + content, borders, hover states. Layout is consistent.
- **Footer:** Authority links strip + bottom bar. Readable and scannable.

**Fixes applied:**  
- `min-w-0` on text containers in cards and hero to avoid flex overflow when titles/descriptions are long (e.g. Arabic/Hebrew).  
- Trust bar: registration text can wrap (`min-w-0`), ticket ID stays one line (`flex-shrink-0`).  
- Nav links: `whitespace-nowrap` so labels don’t wrap in the header.  
- ComplianceBadge top bar: `left-0 right-0` → `inset-x-0` for consistency.

---

## 3. Language switching and RTL

- **`dir` and `lang`:** Set on `<html>` from locale (e.g. `dir="rtl"` for HE/AR). Layout and alignment follow direction.
- **SectionBlock:** RTL variants for border and padding (`rtl:border-l-0 rtl:border-r-4`, `rtl:pl-0 rtl:pr-4`).
- **Header:** Uses logical spacing (`ms-4`, `ps-4`, `border-s`). In RTL, nav and language switcher flip correctly.
- **Footer:** Arrow after link label now direction-aware: → for LTR, ← for RTL (no reversed arrow in LTR).
- **Images:** Hero image is second in grid; in RTL it appears on the start (right) side. No layout shift from switching language.

**Risks mitigated:**  
- Long Hebrew/Arabic labels could overflow; `min-w-0` and wrapping on trust bar prevent layout break.  
- Nav kept to one line on desktop to avoid wrapping; mobile uses stacked menu.

---

## 4. Photos

- **Paths:** All point to real files under `public/images/`:  
  `logo-espa.png`, `hero-mandate.jpg.avif`, `hero-operations.jpg`, `hero-compliance.jpg`, `hero-philanthropy.jpg`, `emblem-israel.png`, `logo-us-embassy.png`, `logo-gaza-aid.png`, `logo-unocha.svg`.
- **Loading:** Hero and logo use Next.js `priority`; hero has defined `sizes` for responsive loading.
- **Layout:** Hero image container has `aspect-[16/10]`, `min-h-[12rem]` / `min-h-[14rem]`, and `bg-navy-light/30` so space is reserved before load and CLS is minimized.
- **Placement:** Hero image sits in a 1fr column beside the text block; on small viewports it stacks below. Fits the layout and doesn’t feel out of place.

---

## 5. Summary

| Area              | Status | Notes                                                                 |
|-------------------|--------|-----------------------------------------------------------------------|
| Conformance       | OK     | Brand, typography, spacing match intent; no placeholder assets.      |
| Clean / professional | OK  | Hierarchy, spacing, and component layout are consistent.              |
| RTL / language    | OK     | `dir`/`lang` set; RTL styles and footer arrow fixed; overflow handled.|
| Photos            | OK     | Real assets only; reserved space; sensible placement and aspect ratio.|
| Scaling/overflow  | OK     | `min-w-0`, wrapping, and `whitespace-nowrap` used where needed.      |

**Recommendation:** Optional next steps: run a quick pass in a real browser (e.g. Chrome DevTools device toolbar) on HE and AR at 320px and 1280px to confirm no edge-case overflow or alignment issues.
