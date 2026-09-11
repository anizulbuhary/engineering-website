# Interface motion

The regular pages use short, one-time entrances and restrained pointer/focus feedback. The engineering scene and hero keep their separate scroll behavior.

- `components/ui/Reveal.tsx` enhances server-rendered content with the Web Animations API. Text/rows move 16 px over 620 ms; images reveal their lower edge over 800 ms. Paired content uses delays capped at 180 ms.
- Entrances run once when content enters the viewport. They do not reserve extra scroll distance, pin sections or run continuously.
- Content is visible before JavaScript and if animation support is unavailable. Reduced-motion preference prevents entrances; changing that preference cancels active animations. Keyboard focus cancels an entrance so links and controls remain stable.
- Text/navigation links draw a fine underline; project and article arrows move a few pixels. Project images and sample previews use slight zoom on deliberate interaction. Keyboard focus receives equivalent feedback.
- Mobile navigation and sample dialogs enter over 200–220 ms. Native dialog focus handling and dismissal are preserved.
- Pointer hover effects are limited to fine pointing devices where appropriate. Reduced motion suppresses image/arrow transforms and dialog entrances.

No new dependencies or content/API changes are required. Visual timing is reviewed separately from automated layout, navigation and accessibility checks.
Verified: lint, TypeScript, production build and all 22 browser tests passed. Separate Chromium reviews at 1440 px and 390 px confirmed one-time entrances, reduced-motion cancellation, keyboard-focus cancellation and image/hover framing. Physical-device and Safari behavior has not been reviewed.
