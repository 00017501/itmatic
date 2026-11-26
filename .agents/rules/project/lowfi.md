---
paths:
  - "prototypes/low-fi/**"
---

# Low-fi: project conventions

What is specific to the ITmatic low-fi. How to build in Figma is in [`figma.md`](../figma.md); design quality is in [`ui-design.md`](../ui-design.md).

The low-fi shows the core functions, the hierarchy and the flow between screens, not visual detail. It is built in Figma; exports and links are kept in `prototypes/low-fi`.

- **Greyscale only.** Black, white and the neutral greys of [`DESIGN.md`](../../../DESIGN.md) (`ink`, `ink-muted`, `line`, `line-strong`, `mist`, `paper`). No brand or status colour; status is shown by its word.
- **Same layout as the high-fi will have.** Spacing, type scale, sidebar on desktop, bottom navigation on phone account screens, all as `DESIGN.md` describes.
- **One frame per screen**, named with the contract ID and name, for example `S07 Lesson record form`. Overlays are their own frames with a letter suffix, for example `S10a Report absence`.
- **Same screens as the contract.** Every screen in [`screens-and-flows.md`](../../contracts/screens-and-flows.md) has a frame, and no frame exists without a row there.
- **Interactive layers** are named with the prefix `tap/`, for example `tap/Save lesson`, and each has a click link to its destination.
- **No dead ends, no orphans.** Every frame can be reached from `S01 Login` and every frame has a way out.
- **Transitions:** dissolve between screens; overlays open as overlays.
- **Real labels, sample content.** Buttons and headings use CW1 terms; lists show two or three seed rows in the CW1 style (`EN-B1-07`, `500,000 so'm`).
- **Exports:** one PNG per frame in `prototypes/low-fi/exports/`, named by frame ID.
- **Links:** `prototypes/low-fi/README.md` holds the Figma file link and the prototype link, both viewable without logging in.
