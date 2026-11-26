---
name: lowfi-prototype
description: Build or change the low-fidelity prototype in Figma through the Figma MCP - agree the screens and flows with the user, create one black-and-white frame per screen, link every interactive element, and verify that no screen is a dead end or unreachable. Use when the user asks for the low-fi, wireframes, the Figma prototype, or a change to its screens or links.
---

Read first: [`brief.md`](../../contracts/brief.md) (B-02, B-06, P-01, R-01), [`screens-and-flows.md`](../../contracts/screens-and-flows.md), [`DESIGN.md`](../../../DESIGN.md), [`ui-design.md`](../../rules/ui-design.md), [`figma.md`](../../rules/figma.md), [`project/lowfi.md`](../../rules/project/lowfi.md), [`figma-examples.md`](../../references/figma-examples.md).

The −6 penalty is for a low-fi that is "just wireframes". The links are what earn the marks, so linking and verifying are not optional steps.

## 0. Check that Figma can be written to

1. Call the Figma MCP `whoami`. Note the plan tier and seat.
2. Load the Figma usage guidance before any write (`figma-create-new-file` before creating a file, `figma-use` before `use_figma`; without the plugin, read the same skills from the MCP resources).
3. Create the file, call `create_session`, then make **one small write**: a single frame with a text layer.
4. If the write is refused, stop. Tell the user the exact error. The MCP cannot change a seat; the user can switch their own seat to Full in Figma's admin settings. The agreed last resort is a linked draw.io file (decision 16).

Read tools (`get_screenshot`, `get_metadata`, `get_design_context`, `download_assets`) are rate limited and the limit for this account is unconfirmed. Tools that write are exempt. So: verify through values returned by `use_figma`, and spend read calls only on the final exports.

## 1. Agree the screens

Run the `grilling` skill on anything the screens contract marks as draft: overlays, what each screen shows, which error messages appear. Update the contract and the decisions log before drawing.

## 2. Build the foundations, then the frames

1. Pages `Cover`, `Screens`, `Components` (see [`figma.md`](../../rules/figma.md)).
2. Greyscale variables and text styles from `DESIGN.md` (section 1 of the examples).
3. The component kit on `Components`, with variants (section 2 of the examples). No screen is drawn before the kit exists.
4. Screens from instances, one frame per screen and per overlay, named and sized as [`project/lowfi.md`](../../rules/project/lowfi.md) says (section 3 of the examples).

- Build in small batches, a few frames per `use_figma` call, and return the created node ids each time.
- Lay the frames out left to right in flow order, in one section per role.
- Name every clickable layer `tap/<label>`.
- Each screen has one title and one primary action; the hierarchy and spacing match what the high-fi will have.

## 3. Link everything

For each `tap/` layer set a click reaction to its destination frame, following the "Links out" column and the flows F1 to F5. Use `NAVIGATE` between screens and `OVERLAY` for S05a, S05b and S10a, and give each overlay a `tap/Close` with a `CLOSE` action. Set one flow starting point on `S01 Login`. Code: section 4 of [`figma-examples.md`](../../references/figma-examples.md); confirm the reaction fields in the `figma-use` reference before the first call.

## 4. Verify the link graph

Run section 5 of the examples (one read-only `use_figma` call). It returns:

- every top-level frame, with the frames its reactions lead to;
- frames **unreachable** from `S01 Login`;
- frames with **no way out** (dead ends); an overlay counts as having a way out if it has a close or back action;
- `tap/` layers with **no reaction**;
- frames missing from the contract, and contract screens missing a frame.

All four lists must be empty. Fix and run again until they are. Then walk F1 to F5 through the returned graph and confirm each click path exists.

## 4b. Look at it in a browser

Follow [`visual-verification.md`](../../rules/visual-verification.md). In Claude Code, load the `claude-in-chrome` skill, open the Figma file, zoom to each section in turn (select it in the layers panel, then Shift+2) and screenshot it. Zoom into dense frames. Fix every clipped, overlapping or misaligned element, in the component where possible, then look again.

## 5. Hand over

1. Set sharing to "Anyone with the link can view" and copy the prototype link (Present, then Share prototype). The MCP cannot do this. In Claude Code use Claude in Chrome; otherwise ask the user. If Figma asks for a seat or plan change, stop and ask the user first.
2. Export one PNG per frame into `prototypes/low-fi/exports/`, named by frame ID. Every frame carries a PNG 2x export setting, so Figma's Export panel (Cmd+Shift+E) exports them all in one go; in Claude Code do this through Claude in Chrome, then copy the files from Downloads. View a few of the PNGs to check them.
3. Write `prototypes/low-fi/README.md`: Figma file link, prototype link, list of frames, date.
4. Open the prototype link in a browser that is not logged in (the Playwright browser, or ask the user to use a private window) and click through F1.

## Before saying it is done

1. The browser look-through in step 4b is done, and its fixes were checked again.
2. Run the `quality-review` skill with scope "low-fi" (in a fresh subagent where possible) and fix every HIGH and MEDIUM finding.
3. Run the `coursework-check` skill with scope "low-fi".

Report the frame count, the four verification lists, the review verdicts and anything the user still has to do by hand.
