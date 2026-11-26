---
name: coursework-check
description: Audit a coursework output against the brief contract and report, per criterion, what is met, what is at risk and which penalty applies. Use before saying any prototype, deploy, screencast, zip or handoff is done, and when the user says "check against the brief", "coursework check" or "are we losing marks". Prefer running it in a fresh subagent when your tool has one, so the check is not anchored on the author's reasoning.
---

Audit the work as the marker would. The brief contract is the source of truth: do **not** invent criteria from general good practice. Do not edit files.

## Process

Work in this order. Do not skip steps.

### 1. Read the criteria

Read [`brief.md`](../../contracts/brief.md) in full. If the check concerns screens or data, also read [`screens-and-flows.md`](../../contracts/screens-and-flows.md) and [`data-model.md`](../../contracts/data-model.md). If a row looks wrong or incomplete, open the PDF page it cites; the PDF wins.

### 2. State the scope

Say what is being checked: low-fi, high-fi, deploy, screencast, zip, handoff, or everything. Rows outside the scope are reported as "out of scope", not skipped silently.

### 3. Look at the real thing

Inspect the actual files and links, never a description of them.

| Scope | Evidence to gather |
| --- | --- |
| Low-fi | Frames and link graph in the Figma file; files in `prototypes/low-fi/` |
| High-fi | `npm run build` result; the running app, flow by flow, against F1 to F5 |
| Deploy | The public links opened while logged out; a deep link refreshed |
| Screencast | The video file and its length from `ffprobe` |
| Zip | The checker output of `build_zip.sh` and the unzipped listing |
| Handoff | The files in `handoff/` and each link in `links.md` |

### 4. Judge each row

For every ID in the brief contract give one status:

- **Met**: evidence seen, cite it.
- **At risk**: partly met, or met only on a reading the marker may not share. Say what would make it safe.
- **Failed**: not met. Name the penalty row (P-01 to P-03) and the points.
- **Not checkable**: the evidence does not exist yet or a tool was unavailable. This is never a pass.

Then check the contracts against each other: every screen S01 to S14 exists in both prototypes with the same links; the app's `types.ts` matches the data model contract. Report differences as findings.

### 5. Report

Use the format below. Rows under "Not in the brief" (U-01 to U-03, R-01) go under their own heading and are never given a brief penalty.

## Output format

```
## Coursework check: <scope>, <date>

| ID | Requirement | Status | Evidence or gap | Penalty if failed |
| --- | --- | --- | --- | --- |
| B-06 | Low-fi drawings linked | Met | 17 frames, 0 dead ends, 0 unreachable | P-01, −6 |

### Not in the brief
| ID | Item | Status | Evidence or gap |

### Contract drift
<screen, link or field that differs between contract, low-fi and high-fi, or "none">

Marks at risk: <points, with the rows that cause them>
Verdict: READY | NOT READY: <the one or two things to fix first>
```

## The discipline

1. **The contract is the criteria.** If it is not a row, it is a suggestion: label it so and keep it out of the table.
2. **Evidence or it did not happen.** Every "Met" cites a file, a link, a count or command output.
3. **Largest penalty first.** No video and no code cost 35 each; lead with those.
4. **Be brief.** One line per row. The user is working against a deadline.
