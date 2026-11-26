---
name: quality-review
description: Review the low-fi Figma file or the high-fi Vue code for design and code quality against DESIGN.md and the ui-design, figma and vue rules - hierarchy, consistency, accessibility, the generated look, Figma craft, Vue style guide - and report findings by severity. Use after building or changing screens, before coursework-check, and when the user says "review the design", "quality review", "review the code" or "does this look good". Prefer running it in a fresh subagent when your tool has one, so the review is not anchored on the author's reasoning.
---

Review the work as a senior product designer and senior Vue reviewer. Enforce the rules documented in this workspace; do **not** invent rules from personal taste. Do not edit files.

`coursework-check` asks "do we lose marks?". This skill asks "is it well made?". Run this one first.

## 1. State the scope

Low-fi (the Figma file, or named frames) or high-fi (the files changed, or named screens). Say which.

## 2. Read the standards

[`DESIGN.md`](../../../DESIGN.md), [`ui-design.md`](../../rules/ui-design.md), and for the scope either [`figma.md`](../../rules/figma.md) with [`project/lowfi.md`](../../rules/project/lowfi.md), or [`vue.md`](../../rules/vue.md) with [`project/hifi.md`](../../rules/project/hifi.md). Also [`screens-and-flows.md`](../../contracts/screens-and-flows.md) for what each screen must do.

## 3. Gather evidence

**Low-fi.** One read-only `use_figma` call that returns, per screen frame: layer names that look generated (`Frame 12`, `Rectangle 4`), containers without auto layout, detached instances, fills or font sizes not bound to a variable or style, and the link graph (use section 5 of [`figma-examples.md`](../../references/figma-examples.md)). MCP screenshots are rate-limited. For looks, open the file in a browser instead (Claude Code: Claude in Chrome): zoom to each section and screenshot it, as [`visual-verification.md`](../../rules/visual-verification.md) describes.

**High-fi.** In `prototypes/high-fi`: run `npm run lint` and `npm run type-check` and keep their output. Read each changed file in full and one place that uses it. Then run Impeccable on the screens in scope: `audit` for technical quality and `critique` for UX (Claude Code `/impeccable …`, Codex `$impeccable …`). Use their findings as evidence; do not repeat them as separate findings.

## 4. Review

Walk the evidence against the rules and the heuristics checklist at the end of `ui-design.md`. For each screen ask: what is the one thing it is for, and does the hierarchy say so?

Filter:

- Report only what you are more than 80% sure is a real problem.
- Skip what lint, type-check or Impeccable already reported; point at their summary instead.
- Merge repeats into one finding ("7 layers named Frame N on S03, S04, S05").
- Skip taste. If no rule covers it, it may be a suggestion, labelled as such.

## 5. Severity

| Severity | Meaning | Examples |
| --- | --- | --- |
| HIGH | Breaks a flow, blocks a user, or drifts from a contract. Fix before moving on. | Dead end or unreachable screen; missing state that leaves the user stuck; contrast below AA; unlabelled input; route or screen missing from the contract; screens that differ between low-fi and high-fi |
| MEDIUM | A rule is broken. Fix in this round. | Two primary actions; off-scale spacing or type; raw colour instead of a token; detached instance; Vue style guide A or B broken; generated-look pattern |
| LOW | Polish. Optional. | Inconsistent wording; uneven alignment; naming that could be clearer |

## 6. Report

```
[SEVERITY] Short title
Where: S05 Debtors list > Table header   (or prototypes/high-fi/src/views/admin/S05DebtorsList.vue:42)
Rule: ui-design.md, Hierarchy   (or DESIGN.md, Components > Buttons; vue.md, Vue style guide)
Issue: One or two sentences.
Fix: What to change.
```

End with:

```
## Quality review summary: <scope>, <date>

Tooling: <lint / type-check / Impeccable results, or "not applicable" for low-fi>

| Severity | Count |
| --- | --- |
| HIGH | 0 |
| MEDIUM | 2 |
| LOW | 1 |

Verdict: READY | FIX FIRST: <the one or two things>
```

A check that could not be run (no Figma access, Impeccable not loaded, build failing) is reported as unavailable, never as clean.
