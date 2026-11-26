# ITmatic student-management system: CW2 prototypes

Prototypes for Coursework 2 of Systems Analysis and Design (6BUIS026C). The case is ITmatic, an education centre in Tashkent.

## Where the prototypes are

| Prototype | Folder | What it is |
| --- | --- | --- |
| High-fidelity | [`prototypes/high-fi`](prototypes/high-fi) | A working Vue web application. Data is mocked in the browser; there is no server. |
| Low-fidelity | [`prototypes/low-fi`](prototypes/low-fi) | A linked, greyscale Figma prototype. The folder holds the links and, once exported, an image of every screen. |

## Links

| What | Link |
| --- | --- |
| Live application | not published yet |
| Low-fidelity prototype (Figma) | https://www.figma.com/proto/aMZGoAy6fupTCqgm9lkhSw/ITmatic-CW2-low-fi-prototype?node-id=6-7&starting-point-node-id=6%3A7 |
| Low-fidelity design file (Figma) | https://www.figma.com/design/aMZGoAy6fupTCqgm9lkhSw |
| Repository | not published yet |

## What the prototypes show

Both prototypes follow the same 14 screens and cover the five functional requirements from Coursework 1:

1. Enrol a new student (administrator)
2. Record a lesson with attendance, topic and homework (teacher)
3. Report an absence before the lesson (parent)
4. Monthly debtors list (administrator)
5. Student and parent account, including payment status

## How to run the high-fidelity prototype

Node.js 22.18 or newer is needed (24.12 or newer on Node 24). From the repository root:

```bash
cd prototypes/high-fi
npm install
npm run dev
```

Then open the address Vite prints, for example `http://localhost:5173/itmatic/`. `npm run build` makes the production build in `dist/`.

The sign-in page lists four demo accounts; one click signs in. They can also sign in with the forms:

| Role | Name | Sign in with |
| --- | --- | --- |
| Administrator | Karimova Nodira | Staff tab, +998 90 700 10 10, any password |
| Teacher | Saidova Dilfuza | Staff tab, +998 90 700 20 20, any password |
| Parent | Aliyeva Dilnoza | Parents and students tab, +998 90 123 45 67, any 6-digit code |
| Student | Aliyeva Malika | Parents and students tab, +998 90 765 00 11, any 6-digit code |

Good to know:

- It is one website for every role. It works on a computer and on a phone (360 px wide).
- The language (English, Russian, Uzbek) is changed from the menu next to the user's name, or on the sign-in page.
- There is no server. The data is example data kept in the browser, so changes stay after a refresh. "Reset demo data", in the same menu and on the sign-in page, restores the starting data.
- The date in the app is fixed at 26.11.2026, so the example gives the same result on any day.
- Some things are simulated, because there is no server:
  - **Sign-in:** any 6-digit code is accepted for a registered phone number, and any password for staff.
  - **Payme and Click:** the QR code is a demo code marked "NOT A REAL PAYMENT"; the confirmation arrives by itself after about two seconds.
  - **Files:** the contract scan and lesson attachments are file names only; nothing is uploaded.
  - **Offline:** a switch on the lesson form stands in for losing the connection.
  - **Debtors list:** calculated when the page opens, not by a job on the 1st of the month.
  - **First fee month:** a contract signed after the 20th makes the next month the first fee month. This rule is an assumption of the prototype.

A suggested walk-through, which shows that the five functions share one set of data:

1. Parent: open Aliyeva Malika, then Schedule, and report an absence for today's lesson.
2. Teacher: open the 09:00 lesson. The absence is shown next to the student. Mark attendance and save the lesson.
3. Administrator: open the debtors list, record a call result and a payment of 300,000 so'm for Aliyeva Malika. Then open Enrolments and complete the enrolment of Karimov Sardor.
4. Parent again: Payments shows "Partly paid, 200,000 so'm due"; Attendance shows today's absence.

## Agent setup

The high-fidelity prototype is built with AI agents, which the brief allows (p2). The low-fidelity prototype was also drawn in Figma by an AI agent, following the agreed screens and flows. The agents work from one shared set of instructions:

- [`AGENTS.md`](AGENTS.md) is the entry point: contracts under `.agents/contracts/`, rules under `.agents/rules/`, examples under `.agents/references/`, skills under `.agents/skills/`. The visual system is in [`DESIGN.md`](DESIGN.md).
- **Claude Code:** `CLAUDE.md` imports `AGENTS.md`; `.claude/rules` links to `.agents/rules`, and `.claude/skills/` holds one link per shared skill.
- **Codex:** start it in this folder so that `AGENTS.md` and `.agents/skills/` are found. Path-scoped rules are opened through the index in `AGENTS.md`. Approve Impeccable's hooks once with `/hooks`.
- **Impeccable** ([impeccable.style](https://impeccable.style)) adds design commands and a design check hook for both tools.
- **Other tools:** load `AGENTS.md`, open the rules it lists, and read `.agents/skills/<name>/SKILL.md` as ordinary Markdown.

If you are reading this from the submission zip: the zip holds this README, the two prototype folders, the video and the AI usage record. The agent setup files listed above are in the repository only.

The prompts used with AI on this coursework are recorded in [`ai-usage/prompts.md`](ai-usage/prompts.md).

The `context/` folder (brief, lecture slides, Coursework 1 report) is kept locally and is not part of the repository.
