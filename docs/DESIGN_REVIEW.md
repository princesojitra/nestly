# Design Review

## Milestone 2 — direction exploration (2026-10-31)

Two directions were mocked up as real rendered previews (Dashboard, Inventory, Asset Detail for each) rather than described in prose. Preview: https://claude.ai/artifact/Y1kxNNvw7eGLqKwRTJWch5 (private — share it from the page's Share menu if others need the link).

### Direction A — Quiet Ivory

Warm ivory background (`#F6F5F0`), sage green accent, charcoal text, soft-stone surfaces, Fraunces serif display type over Inter body text. Hairline borders instead of shadows. Calm, editorial, closest to the palette suggested in the brief.

### Direction B — Studio Dark

Deep charcoal background (`#15171A`), cream text, terracotta accent (`#D97A4D`), bold geometric Space Grotesk display type, elevated dark surfaces. Bolder, more data-forward/"dashboard" feeling.

### Recommendation: Direction A

A home-management app is used to feel in control of a calm, personal space — ivory/sage reads warmer and more approachable than a dark, editorial-dashboard aesthetic, and it's the better default for a broad consumer audience (dark-first apps skew toward technical/finance tooling). Direction A also starts from the palette the brief already proposed, refined rather than replaced. Direction B's type/number treatment (bold display numerals for hero stats) is worth borrowing as the basis for a future dark-mode theme, rather than discarded.

Proceeding with Direction A's tokens — see `docs/DESIGN_SYSTEM.md`.

### Outstanding / not yet covered

- No tablet or landscape layout explored yet.
- No dark-mode variant of Direction A (Direction B's palette is a starting point for one, later).
- Previews are static mockups (Artifact canvas), not the running app — real device/simulator screenshots start in Milestone 3 once the RN project exists, per `CLAUDE.md`'s screenshot-review rule.
