# High-fidelity prototype

The ITmatic student-management system as a working Vue 3 web application, written in TypeScript. There is no server: the data is example data kept in the browser.

How to run it, the demo logins, a suggested walk-through and what is simulated are in the [README at the root](../../README.md).

```bash
npm install
npm run dev
```

| Folder | What is in it |
| --- | --- |
| `src/views` | One file per screen, named with its screen ID (for example `S07LessonRecordForm.vue`) |
| `src/components` | Parts of screens: dialogs, tables, charts, the account menu |
| `src/stores` | The data layer (Pinia): lessons, payments, enrolments, grades, sign-in |
| `src/domain` | The rules: fees and debtors, attendance, enrolment stages, lesson records |
| `src/data/seed.ts` | The example data the app starts with |
| `src/i18n` | English, Russian and Uzbek texts |
| `scripts` | Two checks: the seed totals and the translation keys |

Other commands: `npm run build`, `npm run lint`, `npm run type-check`.
