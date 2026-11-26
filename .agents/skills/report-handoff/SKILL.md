---
name: report-handoff
description: Collect what the Word report needs from this workspace into the handoff folder - the public links (repository, live app, Figma prototype, video), screenshots of each main screen from both prototypes, and the list of entities, fields and operations the app uses for the class diagrams. Use when the user asks for the handoff, the report material, screenshots, the links, or the entity list.
---

Read first: [`brief.md`](../../contracts/brief.md) (B-09, U-02), [`screens-and-flows.md`](../../contracts/screens-and-flows.md), [`data-model.md`](../../contracts/data-model.md).

The report is written elsewhere. The brief asks it to contain "Prototypes (screencast, screenshots and links)", and the class diagrams must match the app. This skill gathers that material; it does not write the report.

## Output

```
handoff/
├── links.md              the four links, each with how and when it was checked
├── screenshots/
│   ├── low-fi/Sxx-<name>.png
│   └── high-fi/Sxx-<name>.png
└── entities.md           entities, fields, enumerations, operations
```

## 1. Links

List the repository, the live app, the Figma prototype and the video. For each one, open it while logged out and record the result and the time. A link that could not be checked that way is marked "not confirmed, please open in a private window". Never mark a link as working on the strength of it working when logged in.

The video in the zip is a file; if the report also needs a link to it, ask the user where they will host it.

## 2. Screenshots

- One per screen S01 to S14 from each prototype, plus the three overlays, named by screen ID so the pairs line up in the report.
- Low-fi: use the exports in `prototypes/low-fi/exports/`.
- High-fi: capture from the running app with seed data, desktop screens at desktop width and phone screens at 360 px wide. If no browser tool is available, give the user the list of routes and sizes to capture.
- Say which screenshots are missing; do not fill gaps with similar screens.

## 3. Entities for the class diagrams

Write `handoff/entities.md` from `prototypes/high-fi/src/types.ts` and the stores, then compare it with the data model contract:

- entities with their fields and types;
- enumerations with their values;
- operations with the entity or store they belong to;
- relationships as the code has them (which entity holds whose id, one or many).

If the code and the contract differ, list the differences at the top, fix the contract, and tell the user, because the diagrams follow this file.

## Before saying it is done

Run the `coursework-check` skill with scope "handoff". Report what is in the folder, which links are confirmed and what the user still has to do.
