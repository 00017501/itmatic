---
name: ai-usage-record
description: Keep the AI usage record ai-usage/prompts.md up to date - read the prompts the user typed since the record was last updated, tidy them into clear prompts without inventing any, add them to the right stage, and check the record. Use at the end of every piece of work, before saying it is done, and when the user says "update the AI usage record", "record my prompts" or "AI usage".
---

Read first: [`brief.md`](../../contracts/brief.md) (U-04), [`writing-style.md`](../../rules/writing-style.md), and the decisions log (decisions 42 to 45).

The record goes in the submission zip (U-04), so a marker reads it. It must be honest: every entry is a prompt the user really made.

## 1. Find what is new

```bash
python3 -I .agents/skills/ai-usage-record/scripts/prompts.py list
```

It reads the Claude Code transcripts for this folder and prints the messages the user typed after the watermark at the top of the record (`<!-- transcripts-read-up-to: ... -->`). It skips tool results, system reminders, hook output, skill text and interrupts. Add `--since <ISO time>` or `--dir <folder>` to override.

- **Other agents (Codex and others):** read your own session history for this folder the same way, or ask the user to paste the prompts.
- **Claude Chat prompts** cannot be read from here. Ask the user whether there are new ones and to paste them; mark them `[Claude Chat]`, or `[Claude Chat → Claude Code]` when the chat drafted a prompt that was then pasted here.

## 2. Choose

The record covers the two prototypes. Keep every prompt that moved that work forward: planning, harness, design, low-fi, hi-fi, deploy, review, submission. Prompts about other parts of the submission (the class diagrams, the report text, the video) are outside the record.

Leave out: small talk, "ok", "continue", "yes do it", typo-only follow-ups, answers in question dialogs (those are decisions, in the decisions log), slash commands for settings, anything about CW1 or unrelated work. A pasted error log becomes "Asked to fix: <problem>" only if it led to a real change. The same message sent to two sessions is one entry.

## 3. Tidy

- Clear, well-structured prompts in the first person, in British spelling; remove filler ("you know", "right").
- Keep the user's decisions and constraints exactly. Never add a request the user did not make.
- Merge closely related messages into one entry and write "(merged ...)" after the tag.
- No secrets, tokens, emails or paths outside this project. A path to another project becomes "my reference harness from another project" or similar.

## 4. Add

- Put each entry in its stage, in time order: Understanding the brief, Planning the hi-fi, Agent harness, Design system and quality rules, Low-fi prototype, Hi-fi prototype, Deployment, Review and submission, AI usage record. Add a stage when its first prompt arrives.
- Entry format, as in the existing entries: `### N.M Heading`, the tag line (`[Claude Chat]`, `[Claude Code]` or `[Claude Chat → Claude Code]`), one italic line "*Purpose: ... Produced: ...*" naming what it produced (cite the decision number where there is one), then the prompt as a blockquote.
- A long pasted prompt goes into an appendix, once, and the entry points to it.
- The record has no closing summary and no `TODO` lines. Where something is unclear, ask the user instead of writing a note into the record.
- Move the watermark to the timestamp of the last message you read.

## 5. Check

```bash
python3 -I .agents/skills/ai-usage-record/scripts/prompts.py check
```

It fails on a missing watermark, a private path, email or token, or an American spelling, and prints the prompt count per stage and per tag. Then check by hand that each decision number cited matches the decisions log, and that the file still reads as 4 to 8 pages.

## Report

Say which prompts were added (heading and tag), which messages were dropped or merged and why, the counts the check printed, and anything you had to ask the user. The record must hold no `TODO (Hamid):` lines.
