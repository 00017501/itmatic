---
name: hifi-prototype
description: Build and extend the high-fidelity Vue prototype in prototypes/high-fi from the agreed screens and flows, with Nuxt UI, the Calm operations design system and the mocked data layer, and keep it runnable and deployable. Use when the user asks for the high-fi, the Vue app, a screen, a flow, seed data, or a fix in the app.
---

Read first: [`brief.md`](../../contracts/brief.md) (B-02, B-03, P-03), [`screens-and-flows.md`](../../contracts/screens-and-flows.md), [`data-model.md`](../../contracts/data-model.md), [`DESIGN.md`](../../../DESIGN.md), [`ui-design.md`](../../rules/ui-design.md), [`vue.md`](../../rules/vue.md), [`project/hifi.md`](../../rules/project/hifi.md), [`writing-style.md`](../../rules/writing-style.md), [`vue-examples.md`](../../references/vue-examples.md).

The high-fi is worth 35 marks and must be "a functioning product". It is built from the low-fi: same screen IDs, same links, same hierarchy, now in full colour.

## 1. Agree before building

Run the `grilling` skill on what is still open: the draft data model, the seed data, and the order of flows if time is short. The visual direction is decided (decision 21, `DESIGN.md`); do not reopen it. Record the answers.

## 2. Scaffold (first run only)

1. In `prototypes/`, run `npm create vue@latest high-fi` and choose TypeScript, Vue Router, Pinia, ESLint and Prettier; no JSX, no test runners.
2. Install Nuxt UI for plain Vue and Vite (`@nuxt/ui` with its Vite plugin and Vue plugin, the main CSS importing Tailwind and Nuxt UI), following the current "Installation > Vue" page of the Nuxt UI docs. Wrap the app in `UApp`.
3. Install `@unovis/vue` and `@unovis/ts` for charts (decision 41). Install vue-i18n and load Onest (Google Fonts, weights 400 and 600, Cyrillic and Latin extended subsets).
4. Map `DESIGN.md` into the theme: an `ink-teal` palette as Nuxt UI's primary colour, the neutrals, radius 6 px, Onest as the sans font, status colours for success and error.
5. Set hash routing and the Vite `base` (see [`project/hifi.md`](../../rules/project/hifi.md)).
6. Create the layout:

```
prototypes/high-fi/src/
├── types.ts            mirrors data-model.md
├── data/seed.ts        seed data the five flows need
├── stores/             one setup store per area; all local storage access is here
├── router.ts           one route per screen, with roles in meta
├── i18n/{en,ru,uz}.ts
├── composables/        useX shared logic
├── components/         admin/, teacher/, account/, shared/ (multi-word names)
└── views/{shared,admin,teacher,account}/Sxx<Name>.vue
```

7. Confirm `npm run dev` serves the login screen and `npm run lint`, `npm run type-check` and `npm run build` pass before writing any feature.

## 3. Build one flow at a time

Finish each flow end to end, data included, before starting the next, so there is always a working app to record.

Default order: app shell and S01, then F2 (lesson record), F3 (report absence), F4 (debtors list), F5 (account), F1 (enrolment). Ask the user if they want another order.

For each flow:

1. Types and store actions, named as in the data model contract.
2. Views from Nuxt UI components, with CW1 wording for labels and the listed error message; one title and one primary action per screen.
3. Empty, error and success states (see [`ui-design.md`](../../rules/ui-design.md)).
4. Text in all three languages.
5. Walk the click path from the flows table in the running app.

Keep the two cross-flow links working: the status from F3 shows as a badge in F2, and the payment from F4 shows in F5.

## 4. Check every time

- Look at every screen you touched in a real browser, as [`visual-verification.md`](../../rules/visual-verification.md) says (Claude Code: Claude in Chrome): 1440 px for administrator screens, 360 px for phone screens, every dialog and error state.

- `npm run lint`, `npm run type-check` and `npm run build` pass.
- Each finished flow works in the browser from a reset state.
- A refresh on a deep link, for example `#/admin/debtors`, stays on that screen and keeps the data.
- Phone screens at 360 px: no sideways scrolling, targets at least 44 px.
- Each role is refused on another role's route.
- The language switch changes every label and survives a reload.
- The Impeccable hook's findings on the files you edited are fixed, not ignored.

## 5. Keep the contracts true

Any new field, entity, operation, screen, link or simulation updates the matching contract in the same piece of work. The class diagrams are drawn from the data model contract, so tell the user when it changes. A new token or component rule goes into `DESIGN.md`.

## Before saying it is done

1. Run Impeccable `polish` on the screens built in this round, then look at them again in the browser.
2. Run the `quality-review` skill with scope "high-fi" (in a fresh subagent where possible) and fix every HIGH and MEDIUM finding.
3. Run the `coursework-check` skill with scope "high-fi".

Report which flows work, what is simulated, what was left out, and the review verdicts.
