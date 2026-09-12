# Interface motion

The site uses balanced editorial motion: one-time, staggered entrances; fine animated rules; and bounded scroll movement on selected photographs. The engineering scene retains its own motion control.

## Shared behavior

`Reveal` enhances server-rendered content with the Web Animations API. Desktop text rises 18 px over 640 ms; phones rise 12 px over 520 ms. Direct-child stagger groups add 70 ms per item, capped at 210 ms. Initially visible content stays opaque. Lower-page content fades from 0.35 opacity during its entrance. Images reveal their bottom 6% over 800 ms. Rules draw across over 600 ms. Filter-result entrances use a 220 ms fade.

Each entrance runs once per mount. Content remains readable without JavaScript, animation support or IntersectionObserver. Reduced motion skips entrances; changing the preference cancels active animations. Keyboard focus immediately cancels a containing entrance, including one that has not started. Forms never animate during editing. Short groups use staggering; long articles reveal section by section, without nested entrances.

`ScrollImage` wraps the studio photograph and project/article cover photographs. A shared scroll scheduler updates only visible images, with one animation frame per scroll batch. Drift is bounded to +/-12 px on desktop and +/-4 px on phones. Overscan prevents exposed edges. Reduced motion resets drift and removes transforms. Observers and listeners are released when images leave the viewport or unmount. Technical drawings do not drift.

Existing underlines, arrows and focus/hover colors use 180?250 ms timing. Hover transforms require a fine pointer and no reduced-motion preference. Native mobile navigation and sample dialogs retain focus containment and restoration.

## Coverage and header

Entrances cover home sections, regular page heroes, service/principle rows, project and article lists/details, samples, contact form groups, privacy content, the 404 page and footer. Gallery filters preserve the filtering buttons and focus while newly shown results fade in.

The homepage action is Contact, linking to the existing `/contact` preview page. Its label and destination live in the content layer. No submission behavior was enabled.

The CSS `--site-header-height` is 72 px at 768 px and above, and 64 px below, including the border. Header sizing, document anchor padding and engineering sticky sizing share this value. Engineering scroll calculations read the same value through `headerHeight`; tests measure the rendered header independently.

## Verification

Browser tests cover stagger order and one-time behavior, bounded image drift, focus cancellation, preference changes, filter/dialog behavior, missing animation support, Contact navigation, responsive routes and JavaScript-free rendering. Existing engineering tests cover the shorter header, forward/reverse chapters, rewind and matching still images. Visual timing is reviewed separately from automated checks.

Coverage is Chromium on Windows, with phone viewport/touch emulation. Physical devices and Safari require separate review; desktop emulation does not establish phone GPU performance.
Verified: lint, TypeScript, production build and all 28 browser tests passed. The homepage/header were visually reviewed at 375, 430, 768, 1024, 1440 and 1920 px. Representative page bodies, forms, cards, footer and rule-animation intermediate frames were inspected at phone and desktop sizes; slow and rapid scrolling were exercised. Engineering still-image comparisons passed with the new header heights.
