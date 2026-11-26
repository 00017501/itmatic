---
paths:
  - "prototypes/high-fi/**"
---

# High-fi: project conventions

What is specific to the ITmatic high-fi. How Vue code is written is in [`vue.md`](../vue.md); design quality is in [`ui-design.md`](../ui-design.md); the visual system is in [`DESIGN.md`](../../../DESIGN.md).

The app lives in `prototypes/high-fi`. It has no backend. It must run with `npm install && npm run dev` and build with `npm run build`.

- **Hash routing.** Use `createWebHashHistory`. GitHub Pages has no rewrites, so clean URLs give a 404 on refresh.
- **Base path.** Vite `base` is `/itmatic/` (decision 19). A wrong base gives a blank page.
- **Routes come from the contract.** One route and one view per screen in [`screens-and-flows.md`](../../contracts/screens-and-flows.md). View files carry the screen ID and a multi-word name, for example `views/teacher/S07LessonRecordForm.vue`.
- **Types come from the contract.** `src/types.ts` mirrors [`data-model.md`](../../contracts/data-model.md): same entity names, fields and enumerations.
- **One data layer.** Views never touch local storage. All reads and writes go through Pinia stores; the operations in the data model contract are store actions with the same names.
- **Seed and reset.** Seed data loads on first run. A "Reset demo data" control restores it. Local storage keys start with `itmatic:`.
- **Role guards.** Each route names the roles that may open it; other roles get the CW1 access message.
- **Three languages.** All interface text through vue-i18n in en, ru and uz (Latin). The choice is remembered. Onest covers Cyrillic and Uzbek `oʻ gʻ`.
- **Layouts.** Administrator screens use the Nuxt UI dashboard layout; teacher and account screens use a phone layout at 360 px.
- **Simulations are listed.** Anything faked (SMS code, scheduled job, upload, offline) has a row under "Simulated in the prototype" in the screens contract.
- **Contract and app change together.** A new field, screen or link updates the contract in the same piece of work.
- **No secrets, no API keys, no network calls** except fonts and the app's own files.
- **Keep it small.** No abstraction for a single use; no library beyond the agreed stack without asking.
