---
name: submission-zip
description: Build the submission zip with the source code, the video and the AI usage record - README, prototypes, screencast and ai-usage/prompts.md at its root, without the harness, context, node_modules, build output, .git or secrets - then unzip it into a temporary folder and check it. Use when the user asks for the zip, the submission archive, or to package the code and video.
---

Read first: [`brief.md`](../../contracts/brief.md) (B-04, B-07, P-02, P-03, U-01, U-04) and [`project/submission.md`](../../rules/project/submission.md).

The zip is the user's stated practice, not a rule in the PDF (U-01). No code and no video cost 35 marks each, so the check matters more than the build.

## 1. Before building

- The video exists at `submission/screencast.mp4` and is at most 60 seconds long (read with `ffprobe`).
- The root `README.md` says where each prototype is, how to run the app, and gives the public links.
- `prototypes/low-fi/` holds the exports and the links file.
- `ai-usage/prompts.md` (the AI usage record) is up to date: run the `ai-usage-record` skill first; its `check` passes and no `TODO (Hamid):` lines are left (decisions 42 to 45).
- The student ID is `00017501` (decision 17), which gives `SAD_CW2_00017501.zip`.

## 2. Build and check

```bash
.agents/skills/submission-zip/scripts/build_zip.sh <student-id> [path-to-video]
```

The script copies only `README.md`, `prototypes/`, the video and `ai-usage/prompts.md` into a temporary folder, zips them as `submission/SAD_CW2_<student-id>.zip`, unzips that into a second temporary folder and checks it. An existing zip with the same name is replaced.

It fails, with a non-zero exit, when:

- `README.md`, the app source (`prototypes/high-fi/package.json` and `src/`), the low-fi files, the video or the AI usage record is missing;
- the video is longer than 60 seconds (not checked if `ffprobe` is unavailable, and it says so);
- anything from the harness, `context/`, `node_modules`, `dist`, `.git` or an `.env` file is inside.

Never work around a failure by editing the script's checks. Fix the cause.

## 3. Report

Show the script's output as it is: each check line, the top-level listing and the size. Then:

- Say where the zip is and its size. If it is large, ask whether the upload has a size limit.
- Remind the user that the Word report is uploaded on its own and never goes into this zip (B-10).

## Before saying it is done

Run the `coursework-check` skill with scope "zip".
