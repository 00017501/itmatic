---
paths:
  - "README.md"
  - ".gitignore"
  - "submission/**"
  - "handoff/**"
---

# Submission conventions

See B-07, B-09, B-10 and U-01, U-02, U-04 in [`brief.md`](../../contracts/brief.md).

## Repository

- **Prototypes are identifiable from the root.** `prototypes/high-fi` is the Vue app, `prototypes/low-fi` holds the Figma links and exports. Do not move or rename these folders.
- **The root `README.md`** says where each prototype is, how to run the app, and gives the public links.
- **Never in the repository:** `context/`, secrets, `.env` files, `node_modules`, build output, `submission/`. Check `git status` before the first push of anything new.
- **The repository is public**, so everything committed is visible to anyone.

## Zip (source code and video)

- Built only with the `submission-zip` skill.
- **At the zip root:** `README.md`, `prototypes/`, the video, and `ai-usage/prompts.md` (the AI usage record).
- **Never in the zip:** the harness (`AGENTS.md`, `CLAUDE.md`, `DESIGN.md`, `PRODUCT.md`, `.agents/`, `.claude/`, `.codex/`, `.impeccable/`), `context/`, `node_modules`, `dist`, `.git`, `.env` files.
- The zip is always unzipped into a temporary folder and checked before it is called ready.

## Report

- The Word report is written elsewhere and uploaded on its own, not zipped, named `SAD_CW2_STUDENTID.docx`.
- What the report needs from here is collected in `handoff/` by the `report-handoff` skill.
- Every link handed over is opened while logged out before it is called working.
