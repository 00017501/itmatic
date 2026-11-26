# Visual verification

Applies to both prototypes. A screen is not done until someone has looked at it rendered in a real browser. Structural checks (link graphs, overflow scripts, lint, type-check) do not see clipped text, overlapping icons or a button that is the wrong size. This rule exists because those defects reached the user on the first low-fi pass.

## When

- After building or changing any screen, overlay or component, and before `quality-review` and `coursework-check`.
- Before saying any UI work is done, and again after fixing what the look-through found.
- Before handing over links: open them in a browser that is not logged in.

## Tool

- **Claude Code:** the Claude in Chrome browser tools (`mcp__claude-in-chrome__*`). Load the `claude-in-chrome` skill first.
- **Other agents:** the browser tool your agent has (Playwright or similar), or export the frames and view the images.
- **Logged-out check:** a browser session with no sign-in, such as the Playwright browser or a private window the user opens. Claude in Chrome uses the user's signed-in profile, so it cannot prove a link is public.
- If no browser tool is available, say so and report the check as not checkable. Never call it passed.

## How

**Low-fi (Figma).** Open the file in the browser. For each section, select it in the layers panel, press Shift+2 to zoom to it, and take a screenshot. Zoom further into dense frames, such as tables and steppers. Exporting the frames as PNG and viewing each image is an equally good check.

**High-fi (Vue).** Run `npm run dev`. Open every route at 1440 px wide for administrator screens and 360 px wide for phone screens. Click through F1 to F5. Screenshot each screen, every overlay or dialog, and each error state.

## What to look for

- Text cut off, clipped or running outside its box; labels wrapping where they should not.
- Elements overlapping: icons over labels, ticks over text, frames over frames on the canvas.
- Buttons, chips and inputs the wrong size; touch targets under 44 px on phone screens.
- Styles that leaked: underlines, wrong weights or colours, raw text without a style.
- Columns and edges that do not line up; uneven spacing; dividers that stop short.
- Primary actions hidden below the fold on phones; content hidden behind fixed bars.
- Screens that are hard to tell apart from their background.
- In the high-fi only: console errors, broken images, layout shift when data loads, and a refresh on a deep link that lands somewhere else.

## Report

List the screens checked, the size used, what was found and what was fixed. Save one screenshot per role (or the exported PNGs) where the user can see them. If a defect comes from a shared component, fix it in the component, so every screen picks up the fix.
