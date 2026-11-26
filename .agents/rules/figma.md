---
paths:
  - "prototypes/low-fi/**"
---

# Figma conventions

How a Figma file is built in this workspace. Project specifics (greyscale, screen IDs) are in [`project/lowfi.md`](project/lowfi.md); the visual system is in [`DESIGN.md`](../../DESIGN.md); worked code is in [`figma-examples.md`](../references/figma-examples.md).

Sources: Figma's help centre guidance on auto layout, components and variants, styles and variables, and prototyping; the Figma MCP's `figma-use` skill.

## File structure

- Pages: `Cover` (title, date, links), `Screens`, `Components`.
- On `Screens`, one section per role (Administrator, Teacher, Parent and student), frames left to right in flow order.
- Frame presets: phone 360 by 800, desktop 1440 by 1024. Overlays are sized to their content.

## Layout

- Auto layout on every container. Absolute position only for overlays and floating elements.
- Set hug and fill on purpose: text and buttons hug, rows and inputs fill their parent.
- Padding and gaps come from the `DESIGN.md` spacing scale only.

## Components

- A single-choice group is one component set with a variant per selected option (for example `Payment method picker`, `Selected=Payme`). Each option has a "change to" interaction to its own variant, so only one can be on. Never give a loose chip its own on/off toggle; that makes the group multi-choice.

- Anything used twice is a component on the `Components` page, with variants for state and size. Minimum set: Button, Input, Select, Checkbox, Table row, List row, Page header, Sidebar, Bottom navigation, Badge, Dialog, Stepper, Toast, Banner.
- Name components as Nuxt UI does (Button, Input, Table, Modal, Stepper) so the high-fi maps one to one.
- Variant properties are named `Type`, `State`, `Size` with plain values (`Primary`, `Disabled`, `Phone`).
- Screens use instances. Never detach an instance; add a variant instead.

## Styles and variables

- Colours as variables, text as text styles, both taken from `DESIGN.md`. No raw hex values or one-off font sizes on a layer.
- Spacing and radius as number variables where the layout uses them.

## Naming

- Every layer has a name that says what it is: `Debtors table`, `Save lesson`, never `Frame 12` or `Rectangle 4`.
- Screen frames carry the contract ID and name.

## Prototyping

- One flow starting point per flow, named after the flow.
- Every interactive layer has a reaction; every screen has a way back.
- Dialogs open as overlays and have a close action.
- One transition style for navigation and one for overlays, used everywhere.

## Working through the MCP

- Claude Code: load the `figma-use` and `figma-generate-design` skills before the first `use_figma` call. Other agents follow this rule and [`figma-examples.md`](../references/figma-examples.md).
- Create nodes with the `$fig` builder or the plain Plugin API, whichever the loaded `figma-use` skill documents. Set reactions on the real nodes after creating them.
- Build in small batches and return the ids created. Verify structure from returned values, because MCP screenshots are rate-limited. Verify looks in a browser, as [`visual-verification.md`](visual-verification.md) says.
- Build the `Components` page before any screen.

## Known pitfalls (found on the first low-fi build)

- `resize()` sets both sizing modes to fixed. After resizing a component that should hug its content, set `primaryAxisSizingMode` or `counterAxisSizingMode` back to `AUTO`. Otherwise buttons cut off their labels and chips overlap their ticks.
- An instance that should stretch needs `layoutSizingHorizontal = 'FILL'` again after its component's sizing changes.
- Long text inside an auto-layout row needs `layoutSizingHorizontal = 'FILL'` and `textAutoResize = 'HEIGHT'`, or it runs out of its frame.
- Text decoration on a label linked to a text property: set it with `setRangeTextDecoration` after linking, then check existing instances, because they keep their old override.
- Figma rejects a link from a frame to itself. Name the current navigation item `Current: …`, not `tap/…`.
- Prototype links only work between frames on the same page. Keep all screens on `Screens`.
- Overlay position and backdrop are read-only in the Plugin API. Set the backdrop by hand in the Prototype panel if it is wanted.
- A phone screen with a long list: put the list in a scrolling content frame and the primary action in a footer bar outside it, so the action stays on screen.
- After moving or adding frames, check that no frame overlaps another on the canvas, leaving room for the frame name above each one.
