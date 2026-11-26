# AGENTS.md

Entry point for agents in this workspace (Codex reads this file; Claude Code imports it from `CLAUDE.md`). Contracts live in `.agents/contracts/`, rules in `.agents/rules/`, skills in `.agents/skills/`.

---

## Project

The prototypes for an individual coursework, CW2 of Systems Analysis and Design (6BUIS026C). The case is ITmatic, an education centre in Tashkent that needs a student-management system. CW2 continues the group coursework CW1.

This workspace covers the **two prototypes only**: the low-fidelity one in Figma and the high-fidelity one in Vue. They are worth 50 of 100 marks (low-fi 15, high-fi 35). The UML class diagrams, the methodology section and the Word report are written elsewhere; this workspace owes the report a handoff (links, screenshots, screencast, entity list).

Deadline: 26.11.2026 (brief p1).

## Read first

1. [`.agents/contracts/brief.md`](.agents/contracts/brief.md): every prototype requirement, mark and penalty, with the page of the PDF. **Read it before producing anything.**
2. [`.agents/contracts/decisions.md`](.agents/contracts/decisions.md): what the user has already decided. Do not ask it again.

## Sources of truth

Highest first. When two disagree, the higher one wins; fix the lower one and tell the user what differed.

1. The brief: `context/course-materials/cw2-brief.pdf`
2. The CW1 report: `context/cw1-report.docx` (requirements FR-01 to FR-05, NFR-01 to NFR-05, the activity diagram and four sequence diagrams the prototypes must stay consistent with)
3. The contracts in `.agents/contracts/`
4. The prototypes

## Layout

```
.
├── AGENTS.md               # this file (CLAUDE.md imports it)
├── DESIGN.md               # design contract: Calm operations tokens and rules (Impeccable format)
├── PRODUCT.md              # product context for Impeccable (written by /impeccable init)
├── README.md               # for the marker: where each prototype is, how to run, links
├── .agents/
│   ├── contracts/          # brief, screens and flows, data model, decisions log
│   ├── rules/              # generic conventions (ui-design, figma, vue, writing, compliance)
│   │   └── project/        # ITmatic-specific conventions (lowfi, hifi, submission)
│   ├── references/         # worked examples for the figma and vue rules
│   └── skills/             # one <name>/SKILL.md each, plus Impeccable's Codex copy
├── .claude/                # Claude Code only
│   ├── rules -> ../.agents/rules
│   ├── skills/             # one link per shared skill, plus Impeccable's Claude copy
│   └── agents/             # subagent wrappers (coursework-checker, quality-reviewer) and Impeccable's agents
├── .codex/hooks.json       # Impeccable's design hook for Codex
├── context/                # READ-ONLY: brief, lectures, CW1 report (index in context/README.md). Never in git, never in the zip
├── prototypes/
│   ├── low-fi/             # Figma links and exported frames
│   └── high-fi/            # the Vue app
├── handoff/                # created by report-handoff: links, screenshots, entities
└── submission/             # created by submission-zip: video and zip. Never in git
```

## Working agreements

- High-fi: a Vue app in `prototypes/high-fi`, TypeScript, Nuxt UI, no real backend, data mocked with seed data and local storage, deployed on GitHub Pages with hash routing.
- Low-fi: built in Figma through the Figma MCP. Interactive, greyscale, simpler than the high-fi, same hierarchy and layout.
- One visual system for both: "Calm operations" in [`DESIGN.md`](DESIGN.md). Follow it; do not restyle per screen.
- The high-fi is built from the low-fi. Both follow the same 14 screens and five flows; most polish goes into the high-fi.
- Both prototypes cover all five CW1 functional requirements, happy path each.
- British spelling, for example "enrolment". When revising text the user edited, keep the user's wording.
- Ask instead of guessing. Use the `grilling` skill, a few questions at a time, and record the answers.

## Contracts

> All are located inside [`.agents/contracts/`](.agents/contracts/)

- [`brief.md`](.agents/contracts/brief.md) - the coursework requirements, marks, penalties and submission rules, each with page and quote.
- [`screens-and-flows.md`](.agents/contracts/screens-and-flows.md) - the one list of screens, roles, routes and links both prototypes follow, traced to CW1.
- [`data-model.md`](.agents/contracts/data-model.md) - entities, fields and operations shared by the mocked data and the app. The class diagrams are drawn from it.
- [`decisions.md`](.agents/contracts/decisions.md) - dated decisions and open questions.
- [`DESIGN.md`](DESIGN.md) (project root, where Impeccable reads it) - colours, type, spacing, components and do's and don'ts for both prototypes.

Contracts and prototypes change together. A screen, link, field or operation that changes in a prototype changes in its contract in the same piece of work.

## Rules

> All are located inside [`.agents/rules/`](.agents/rules/)

Read the relevant rule before starting. Claude Code loads a path-scoped rule only once a matching file is read or edited; any other agent, or any plan made before touching files, opens the rule itself. Each entry: when to read → what it covers.

Generic (industry standards, each rule names its sources):

- [`coursework-compliance.md`](.agents/rules/coursework-compliance.md) - read always: brief contract first, check before done, never invent a requirement.
- [`writing-style.md`](.agents/rules/writing-style.md) - read when writing any text: British spelling, plain wording, the user's edits kept, CW1 terms and messages.
- [`visual-verification.md`](.agents/rules/visual-verification.md) - read before saying any UI is done: look at every screen rendered in a real browser (Claude Code: Claude in Chrome), what to look for, and the logged-out link check.
- [`ui-design.md`](.agents/rules/ui-design.md) - read before designing or building any screen: hierarchy, consistency, WCAG 2.2 AA, states and feedback, the generated look to avoid, the heuristics checklist.
- [`figma.md`](.agents/rules/figma.md) - read when working in Figma: file structure, auto layout, components and variants, variables and styles, naming, prototyping, working through the MCP. Examples: [`figma-examples.md`](.agents/references/figma-examples.md).
- [`vue.md`](.agents/rules/vue.md) - read when touching `prototypes/high-fi`: Vue style guide A and B, `<script setup>`, Pinia, router, Nuxt UI, Tailwind, accessibility, TypeScript, tooling. Examples: [`vue-examples.md`](.agents/references/vue-examples.md).

Project-specific:

- [`project/lowfi.md`](.agents/rules/project/lowfi.md) - read when touching the low-fi: greyscale, screen IDs as frame names, `tap/` layers, no dead ends, exports and links.
- [`project/hifi.md`](.agents/rules/project/hifi.md) - read when touching the high-fi: hash routing, base `/itmatic/`, routes and types from the contracts, one data layer, seed and reset, roles, three languages.
- [`project/submission.md`](.agents/rules/project/submission.md) - read when touching the README, the repository, the zip or the handoff: what must be identifiable, what must never be included.

## Skills

| Trigger | Skill |
| --- | --- |
| Before any significant piece of work; an unanswered decision | `grilling` |
| Before saying any output is done; "are we losing marks?" | `coursework-check` |
| After building or changing screens; "is it well made?" | `quality-review` |
| Design vocabulary and checks for the high-fi: critique, audit, polish, typeset, layout, harden | `impeccable` (third-party; `/impeccable <command>` in Claude Code, `$impeccable` in Codex) |
| Low-fi screens, frames or links in Figma | `lowfi-prototype` |
| The Vue app: a screen, a flow, seed data, a fix | `hifi-prototype` |
| Repository, GitHub Pages, the live link | `deploy` |
| The zip with source code and video | `submission-zip` |
| Links, screenshots and entity list for the report | `report-handoff` |
| End of every piece of work; "record my prompts", "AI usage" | `ai-usage-record` |

Skills live in [`.agents/skills/`](.agents/skills/); use the named skill when its trigger fits. Usual order: `lowfi-prototype` → `hifi-prototype` → `deploy` → `report-handoff` → `submission-zip`, with `grilling` at the start of each, and `quality-review` then `coursework-check` at the end of each prototype skill. `ai-usage-record` runs at the end of every piece of work, whatever the skill.

Claude Code sees shared skills through one link each in `.claude/skills/`. When you add a shared skill under `.agents/skills/`, add its link too: `ln -s ../../.agents/skills/<name> .claude/skills/<name>`.

## Check before done

| Output | Required before saying it is done |
| --- | --- |
| Low-fi | Link graph verified: no dead end, no unreachable frame, no unlinked `tap/` layer; every section looked at in a browser and the fixes checked again; `quality-review` and `coursework-check` scope low-fi |
| High-fi | `npm run lint`, `type-check` and `build` pass; every screen looked at in a browser at 1440 and 360 px; each finished flow walked in the browser; refresh on a deep link; Impeccable `polish`; `quality-review` and `coursework-check` scope high-fi |
| Deploy | Public links opened in a browser that is not logged in; `coursework-check` scope deploy |
| Screencast | Length read with `ffprobe`, at most 60 seconds; `coursework-check` scope screencast |
| Zip | `build_zip.sh` ends with `RESULT: READY`; `coursework-check` scope zip |
| Harness or contract files only | Links resolve, spelling checked, contracts still agree with each other |
| Every piece of work, in addition to the rows above | `ai-usage-record` run: the user's new prompts added to `ai-usage/prompts.md`, tidied, and its `check` passes |

Report each check as met, at risk, failed or not checkable. A check that could not be run is never a pass.

## Agent orchestration

- Use a smaller model for bounded tasks that are easy to verify: inventories, exports, mechanical edits.
- Use a stronger model where a wrong answer is expensive: the coursework check, design decisions, debugging.
- Run `quality-review` and `coursework-check` in fresh subagents when your tool has them, so they are not anchored on the author's reasoning. Review inline and say so when it does not.
- Delegate only when useful; small tasks stay inline.

## Boundaries

### ✅ Always

- Read the brief contract and the decisions log before producing coursework output
- Run `coursework-check` before saying work is done, and report its result as it is
- Keep both prototypes on the same screens and flows as the contract
- Update the matching contract in the same piece of work as the prototype
- Add the user's prompts to the AI usage record with `ai-usage-record` before saying a piece of work is done
- Record the user's answers in the decisions log with the date

### ⚠️ Ask first

A request that names an item below authorises it; do not ask again for it. A request that does not name the item never implies it.

- Creating the public repository, pushing to it, or anything else visible outside this machine
- Adding or removing a screen, flow or entity
- Adding a dependency beyond the agreed stack
- Editing `AGENTS.md`, `CLAUDE.md`, `.agents/rules/` or `.agents/skills/`
- Overwriting text the user has written

### 🚫 Never

- Move, rename, edit or delete anything in `context/`
- Delete files in this workspace without being asked
- Invent a requirement that is not in the brief
- Commit `context/`, secrets, `.env` files or anything that identifies other students
- Put the harness or `context/` in the submission zip
- Say a link works without opening it while logged out
- Mark a check as passed when it could not be run
