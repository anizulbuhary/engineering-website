# Understanding and navigation

The site should answer three questions without specialist knowledge: what the studio does, what the visitor receives, and where to go next.

- The homepage introduces the audience and outputs in plain English. BIM and bar bending schedules are explained where they first become useful.
- Main navigation uses Services, Projects, Drawing samples, About and Contact. Mobile also includes Home. Why Us and Insights remain in the footer, and all existing route URLs are preserved.
- The building introduction explains the six-step story and includes a native link to Services. With JavaScript, the link moves directly past the long animation and transfers keyboard focus to the services section. Without JavaScript, the same anchor works with smooth scrolling disabled for that target. The link sits outside the sticky stage so the model controls and paused composition retain their space.
- Service descriptions explain the work, and the Services page lists the outputs under “What you receive.” Each service includes an example and a contextual Contact link.
- Expanded examples span both service columns from 768 px upwards, with the drawing on the left and its explanation on the right. Phones retain the stacked preview. Native disclosure, keyboard behavior and JavaScript-free access are preserved.
- Drawing previews have a visible Open preview label as well as an icon. Existing filters, dialogs and PDF downloads retain their behavior.
- Contact has four identity/project fields, optional company/location labels, guidance for choosing services and a short example brief. No enquiry data is submitted or saved.
- The requested sample email is `hello@formwork.example`, explicitly labelled as not monitored. It is a placeholder, not a functioning contact channel.

Brand, themes, project imagery and motion remain in place. This change adds no dependency, backend, submission integration or new public route.

## Review

`tests/usability.spec.ts` checks navigation labels, the keyboard story bypass, service-to-contact paths and the JavaScript-free bypass. Existing suites cover responsive routes, accessible controls, preview privacy, themes and building playback.

Visual captures of the hero, mobile menu, service rows and Contact are in `artifacts/usability-review/`, at 375, 430, 768, 1024, 1440 and 1920 px in both themes. Browser coverage is Chromium on Windows with emulated viewports; Safari and physical devices are not covered. These checks verify functionality and layout, not comprehension by real visitors.

Lint and the production build (including TypeScript) passed. The initial full browser run passed 66 of 68 tests. One phone model-loading timeout passed in isolation; the JavaScript-free bypass exposed a long native smooth scroll, now disabled for that anchor. After the fix, all ten usability and opening/pause checks passed, including both previously failing cases. The other 58 tests were not repeated after that scoped CSS correction.
