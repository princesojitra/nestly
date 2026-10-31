# Design System

Direction chosen: **A — Quiet Ivory** (see `docs/DESIGN_REVIEW.md` for the comparison against Direction B).

## Color

| Token | Value | Use |
|---|---|---|
| `color.bg` | `#F6F5F0` | App background (warm ivory) |
| `color.surface` | `#FFFFFF` | Cards, inputs |
| `color.surfaceSoft` | `#E8E5DC` | Secondary surfaces, image placeholders (soft stone) |
| `color.surfaceDark` | `#242923` | Inverted cards (hero stats), bottom-bar active states |
| `color.accent` | `#A4B39A` | Sage — progress fills, highlights, chart emphasis |
| `color.accentText` | `#5E7254` | Sage darkened for text/icons on light surfaces (contrast-safe) |
| `color.accentTint` | `#EEF1EA` | Sage tint for icon chips, badges |
| `color.text` | `#242923` | Primary text (charcoal) |
| `color.textMuted` | `rgba(36,41,35,0.55–0.65)` | Secondary/tertiary text |
| `color.line` | `#ECE9DF` / `#E3E0D5` | Hairline borders |

All text/background pairs above meet WCAG AA (4.5:1) at body sizes — verify any new pairing before shipping.

## Typography

- **Display** (screen titles, hero numbers): Fraunces, 500/600 weight.
- **UI / body**: Inter, 400–700 weight.
- Scale: 11 / 12 / 13 / 15 / 18 / 22 / 26 px. No hardcoded `fontSize` outside this scale — expose it as a `theme.typography` map so Dynamic Type / font-scale settings can multiply it.

## Spacing & radius

- Spacing: 4px base grid — 4, 8, 10, 12, 14, 16, 20, 24, 32.
- Radius: 10 (chips/small controls), 14–16 (cards), 18–20 (sheets, hero cards), pill (999) for tags/tab pills.

## Elevation

Prefer a 1px hairline border (`color.line`) over shadow for cards on the ivory background. Reserve shadow for true overlays (sheets, modals): `0 8px 24px rgba(36,41,35,0.08)`.

## Icons

A single stroke-style icon set (24px grid, 1.75–2px stroke, round caps/joins) used identically on iOS and Android — platform SF Symbols don't exist on Android, so a shared SVG set (e.g. Lucide/Phosphor, stroke variant) keeps parity instead of splitting by platform.

## Components to build first

Button (primary/secondary), Card, StatTile, ListRow (icon + title + subtitle + trailing), Chip/FilterPill, Badge/StatusTag, ProgressBar, TabBar, EmptyState, Input, BottomSheet. Each gets light-mode tokens now; dark-mode token values (see Direction B in the design review) are deferred until a dark-mode theme is explicitly scoped.
