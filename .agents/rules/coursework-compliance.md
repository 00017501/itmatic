# Coursework compliance

Applies to every piece of work in this workspace.

## Before starting

- Read [`../contracts/brief.md`](../contracts/brief.md). It lists every requirement, mark and penalty with its page in the PDF.
- Read [`../contracts/decisions.md`](../contracts/decisions.md) so that nothing already decided is asked again.
- For anything about screens or data, read [`../contracts/screens-and-flows.md`](../contracts/screens-and-flows.md) and [`../contracts/data-model.md`](../contracts/data-model.md).

## Sources of truth, in order

1. The brief PDF: `context/course-materials/cw2-brief.pdf`.
2. The CW1 report: `context/cw1-report.docx`.
3. The contracts in `.agents/contracts/`.
4. The prototypes.

When two disagree, the higher one wins. Fix the lower one and tell the user what differed.

## Rules

- **Never invent a requirement.** A requirement has a row in the brief contract or it is not a requirement. Ideas are offered as suggestions and labelled as such.
- **Check before done.** Run the `coursework-check` skill before saying any coursework output is finished, and report its result as it is.
- **Ask, do not guess.** A decision the brief, the contracts and the decisions log do not answer goes to the user through the `grilling` skill. Facts are looked up.
- **Record decisions.** Every answer goes into the decisions log with the date.
- **Record prompts.** Before saying a piece of work is done, run the `ai-usage-record` skill so the user's prompts are in `ai-usage/prompts.md`, tidied but never invented.
- **Report honestly.** A check that could not be run is "not checkable", never a pass.
- **Leave `context/` alone.** Never move, rename, edit or delete anything in it.
