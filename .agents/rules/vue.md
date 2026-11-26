---
paths:
  - "prototypes/high-fi/**"
---

# Vue conventions

How Vue code is written in this workspace. Project specifics (routing mode, contracts, seed data) are in [`project/hifi.md`](project/hifi.md); the visual system is in [`DESIGN.md`](../../DESIGN.md); worked code is in [`vue-examples.md`](../references/vue-examples.md).

Sources: the official Vue style guide (priority A essential and B strongly recommended); the Vue, Vue Router, Pinia and Nuxt UI documentation. Check current APIs in the docs rather than relying on memory.

## Stack

Vue 3, TypeScript, Vite, Vue Router, Pinia, Nuxt UI (in plain Vue through `@nuxt/ui/vite` and `@nuxt/ui/vue-plugin`), Unovis (`@unovis/vue`, `@unovis/ts`) for charts, Tailwind CSS v4 (comes with Nuxt UI), vue-i18n, ESLint and Prettier.

## Vue style guide (A and B are mandatory)

- Component names are multi-word (`LessonRecordForm`, not `Form`). Files are PascalCase and match the component name.
- Our own base components start with `Base`; tightly coupled children start with the parent's name (`DebtorsTable`, `DebtorsTableRow`).
- Names use full words (`StudentAttendanceList`, not `StdAttList`).
- Props are typed; `v-for` always has a stable `:key` (an id, never the index); never `v-if` and `v-for` on one element.
- Components with no content are self-closing in SFCs. Directive shorthands (`:`, `@`, `#`) are used everywhere or nowhere.

## Components

- `<script setup lang="ts">` only. Block order: script, template, style.
- `defineProps<{ … }>()` with types; `withDefaults` for defaults; typed `defineEmits`; `defineModel` for v-model.
- Derived values are `computed`, never copied into state. Watchers only for side effects (saving to local storage, focusing a field).
- Logic shared by two components becomes a composable `useX` in `src/composables/`.
- A component over about 200 lines is split.
- No direct DOM manipulation; use template refs when unavoidable. No `v-html` with data.

## State and routing

- Pinia setup stores (`defineStore('lessons', () => { … })`). Destructure with `storeToRefs`.
- Views read and write data only through stores; stores own persistence.
- Named routes; views are lazy-loaded (`component: () => import(...)`); roles in route `meta`; guards in one place in the router.

## Charts (Unovis)

- Wrap every chart in our own multi-word component (`AttendanceTrendChart`, `GradeProgressChart`, `EnrolmentFunnelChart`). Views never use Unovis directly.
- Chart components take the derived values from the stores as typed props (data-model.md) and never calculate in the template.
- Theme through Unovis CSS variables, with the DESIGN.md "Charts" rules: one hue, no colour cycling, no gradients. Meters (`FeeMeter`, `CollectionMeter`) use Nuxt UI `UProgress` or plain markup, not Unovis.
- Each chart has a takeaway line, a tooltip, an `aria-label` and a table view. Check the current Unovis API in its documentation.

## Nuxt UI

- Use the Nuxt UI component for a job before writing one: UButton, UInput, USelect, UForm and UFormField, UTable, UModal, USlideover, UStepper, UBadge, UTabs, UToast through `useToast`, and the dashboard layout UDashboardGroup, UDashboardSidebar, UDashboardPanel, UDashboardNavbar.
- Theme through Nuxt UI's colour aliases, CSS variables and app config, using the `DESIGN.md` tokens. Do not restyle a component's internals with long class strings.
- Forms use UForm with a schema so errors appear next to fields.

## Tailwind

- Tokens from `DESIGN.md` live in the theme (`@theme` in the main CSS). Utility classes use those tokens.
- No arbitrary values (`mt-[13px]`) without a comment saying why.
- A repeated group of classes becomes a component, not an `@apply`.

## Accessibility in templates

- Actions are `<button>` (or UButton); navigation is `<a>` or `RouterLink`. Never a clickable `<div>`.
- Every input has a label tied to it (UFormField does this).
- Icons that carry meaning have a text label or `aria-label`.
- Toasts and inline confirmations are announced (`aria-live`).
- Keep visible focus styles; never remove outlines without a replacement.

## TypeScript

- `strict` on. No `any`; use `unknown` and narrow it.
- Domain types come from `src/types.ts`; do not redeclare them in components.

## Tooling

- Scaffold with `npm create vue@latest` and choose TypeScript, Router, Pinia, ESLint and Prettier. Node 25.3 on this machine is supported.
- `npm run lint`, `npm run type-check` and `npm run build` pass before any piece of work is called done.
