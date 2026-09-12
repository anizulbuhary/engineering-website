# FORMWORK appearance

The site supports Light, Dark and System. The header's Appearance button opens a native radio group with keyboard selection, Escape and outside-click dismissal. The control reserves a 44 px square before hydration and becomes visible when functional. Header heights remain 72 px on tablet/desktop and 64 px below 768 px.

## Color roles

Semantic tokens live in `app/globals.css`. Existing Tailwind utilities map to those roles, so routes and shared components inherit the selected theme. Keep new interface colors in this system.

| Role             | Light     | Dark      |
| ---------------- | --------- | --------- |
| Page             | `#F4F2ED` | `#191B19` |
| Section          | `#D9D5CC` | `#232723` |
| Raised surface   | `#F4F2ED` | `#2D322D` |
| Primary text     | `#171918` | `#F0EDE6` |
| Secondary text   | `#545A55` | `#B8BDB4` |
| Accent           | `#9C3E1C` | `#DBA078` |
| Decorative rule  | `#D1D0C8` | `#414941` |
| Control boundary | `#545A55` | `#7E8B7D` |
| Focus            | `#9C3E1C` | `#E7B48F` |

Use `border-control` for input boundaries and `border-line` for decorative divisions. Photography is unchanged. The interactive SVG inherits theme text, accent and page colors; its frame uses a dedicated drawing surface. External sample SVGs, the project plan and PDFs retain their original paper colors. Their surrounding frames adapt to the theme.

The footer and contact invitation use `.permanent-dark` and `--on-dark-*` tokens. The dossier package has a dedicated dark surface. These sections retain their existing appearance in either theme. The engineering story, Three.js lighting/materials and captured paused image are independent of the page theme.

## Preference behavior

- `lib/theme-preference.ts` defines `ThemePreference` and the trusted pre-paint script used in the root layout.
- `lib/theme-store.ts` synchronizes the root `data-theme` attribute, the appearance control and other tabs. It uses `useSyncExternalStore`; page content and the building do not remount when colors change.
- `content/appearance.ts` contains the control labels and description.
- Only an explicit choice writes `formwork-theme` to local storage. Missing or invalid values resolve to System. No cookie, request or backend is involved.
- The root attribute stores the preference, including `system`. CSS resolves System using `prefers-color-scheme`, including without JavaScript. Native `color-scheme` follows the resolved theme.
- Blocked storage is caught. A manual choice still works during the current client-side session; a fresh document returns to the device preference if it cannot read storage.
- Device changes apply while System is selected. Storage changes or deletion in another tab update open pages. Subscriptions are cleaned up on unmount.
- Color transitions are suppressed for two animation frames during a change. Existing transforms, opacity entrances, image drift and building playback retain their state and timing.

## Validation record

Validated locally in Chromium on Windows, with emulated desktop, tablet and phone viewports. Safari, physical phones/tablets and assistive-technology applications were not available; browser accessibility checks do not replace that coverage.

The expanded browser suite covers both themes across 375, 430, 768, 1024, 1440 and 1920 px; appearance keyboard behavior; device defaults; explicit choices; reload and navigation; live System changes; cross-tab updates; invalid/blocked storage; JavaScript-free rendering; reduced motion; and saved preferences with application JavaScript blocked before hydration. The latter verifies pre-hydration output, not a hardware filmstrip measurement of first paint.

Building tests exercise both themes through chapters in both scroll directions, rewind, six visible paused steps, graphics failure and strict opening/static/resumed pixel comparisons on phone and desktop. A separate theme-switch test preserves the same canvas at an intermediate animation position and preserves the paused image source and drawing selection.

Contact checks allow the appearance preference while still rejecting enquiry transmission or storage. Axe checks cover representative routes, open dialogs and the appearance panel. The preview form remains non-submitting.

Visual review is separate from the browser assertions. Local captures and comparison sheets are in the ignored `artifacts/theme-review/` directory: both themes at all six widths, including the hero, appearance panel, mobile navigation, focused form, sample dialog, all three drawing layers, paper plan, dossier package and footer. Existing light plan captures at 375 and 1440 px are pixel-identical; the companion and reference drawing comparisons have mean RGB differences below 0.41 on a 0–255 scale, with matching dimensions. The appearance control is the intended header layout change.

Calculated dark contrast across page, section and raised surfaces is at least 11.19:1 for primary text, 6.84:1 for secondary text, 5.80:1 for accents, 3.66:1 for control boundaries and 7.05:1 for focus. The drawing's contextual lines at 60% opacity composite to 3.81:1 against their actual surface. Fainter grids and inactive overlays are supplementary; labels and selected layers remain legible.

Lint, TypeScript and the production build passed. The final full browser run passed 53 of 54 checks; its remaining assertion sampled camera progress before easing finished. After making that test wait for the existing progress-meter target, its focused rerun passed. All 54 checks have passing results, with no application changes required for those test corrections.

Run validation with `npm run lint`, `npm run typecheck`, `npm run build` and `npm run test:e2e`.
