---
name: ITmatic
description: Student management for an education centre in Tashkent. Calm operations, built for daily work.
colors:
  paper: "#FFFFFF"
  mist: "#F5F7F8"
  ink: "#14202A"
  ink-muted: "#52606B"
  line: "#D5DCE1"
  line-strong: "#7A8792"
  ink-teal: "#0F5E63"
  ink-teal-deep: "#0B4A4E"
  ink-teal-wash: "#E6F0F0"
  paid: "#1F7A4D"
  debt: "#B3261E"
  pending: "#8A5300"
  chart-teal-light: "#5F969A"
  chart-teal-mid: "#357A7F"
typography:
  page-title:
    fontFamily: "Onest, system-ui, sans-serif"
    fontSize: "28px"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.01em"
  section-title:
    fontFamily: "Onest, system-ui, sans-serif"
    fontSize: "20px"
    fontWeight: 600
    lineHeight: 1.3
  body:
    fontFamily: "Onest, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.5
  body-compact:
    fontFamily: "Onest, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.45
  label:
    fontFamily: "Onest, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 600
    lineHeight: 1.3
  caption:
    fontFamily: "Onest, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.4
rounded:
  sm: "4px"
  md: "6px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  xxl: "48px"
components:
  button-primary:
    backgroundColor: "{colors.ink-teal}"
    textColor: "{colors.paper}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    height: "40px"
  button-primary-hover:
    backgroundColor: "{colors.ink-teal-deep}"
  button-secondary:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    height: "40px"
  button-phone:
    height: "48px"
  input:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    height: "44px"
  table-row:
    typography: "{typography.body-compact}"
    height: "44px"
  badge:
    typography: "{typography.caption}"
    rounded: "{rounded.full}"
    padding: "2px 8px"
---

# Design System: ITmatic

## Overview

**Calm operations.** ITmatic replaces spreadsheets, Telegram groups and phone calls for administrators, teachers and parents. The interface should feel like a well-kept register: quiet, exact, trustworthy with money and children's attendance. Nothing competes with the data.

- **Administrators** work at a desk, all day, in dense lists (enquiries, enrolments, the debtors list). Compact, scannable, keyboard-friendly.
- **Teachers** use a phone at the start of a lesson, often in a hurry, sometimes offline. Large targets, one task per screen.
- **Parents and students** check a phone occasionally. Plain answers first: next lesson, attendance, what is owed.

Interface languages are English, Russian and Uzbek (Latin). Dates DD.MM.YYYY, money in so'm.

## Colors

All text colours meet WCAG 2.2 AA (4.5:1) on `paper` and `mist`; `line-strong` meets 3:1 for control borders.

### Primary
- **Ink teal** `#0F5E63`: the one brand colour. Primary buttons, the active navigation item, links, focus rings. White on ink teal is 7.5:1.
- **Ink teal deep** `#0B4A4E`: hover and pressed states.
- **Ink teal wash** `#E6F0F0`: selected row, active filter, the current step.

### Neutral
- **Paper** `#FFFFFF`: content surfaces. **Mist** `#F5F7F8`: the app background behind content, table headers.
- **Ink** `#14202A`: text. **Ink muted** `#52606B`: secondary text, table metadata.
- **Line** `#D5DCE1`: dividers. **Line strong** `#7A8792`: input and control borders.

### Status
- **Paid** `#1F7A4D`, **Debt** `#B3261E`, **Pending** `#8A5300` (promised payment, late, waiting list).
- Status always pairs colour with a word ("Paid", "200,000 so'm due", "Late ~15 min"), never colour alone.

### Named rules
- **One brand colour.** Ink teal is the only accent. Status colours are for status, never decoration.
- **No gradients, no tinted shadows, no coloured backgrounds behind whole sections.**

## Typography

**Onest** (Google Fonts, open licence), chosen because it was drawn for Cyrillic and Latin together and covers Uzbek `oʻ gʻ`. One family, two weights: 400 and 600. Fallback `system-ui`.

### Hierarchy
- **Page title** 28/600: one per screen.
- **Section title** 20/600.
- **Body** 16/400 on phones; **body compact** 14/400 in administrator tables and forms.
- **Label** 14/600: buttons, form labels, table headers.
- **Caption** 12/400: badges, timestamps ("saved at 14:05").
- Amounts and dates use tabular figures (`font-variant-numeric: tabular-nums`) and align right in tables.

### Named rules
- Sentence case everywhere. No all-caps labels, no letter-spaced eyebrows above headings.
- Line length under 75 characters for any paragraph.

## Layout

- 4/8-point spacing: `xs 4`, `sm 8`, `md 16`, `lg 24`, `xl 32`, `xxl 48`. Nothing off the scale.
- **Desktop (administrator):** sidebar navigation 248 px on the left, content in a panel with a header row (page title left, primary action right). Tables fill the panel width; forms max 640 px wide.
- **Phone (teacher, parent, student):** designed at 360 px, single column, 16 px side padding, primary action fixed at the bottom within thumb reach, bottom navigation for the account screens.
- Left-aligned text; numbers right-aligned in tables.

## Elevation & Depth

Flat. Separation comes from `line` borders and the `mist` background, not shadows. The only shadow is on overlays (modal, slideover, dropdown, toast), one soft level, so they read as above the page.

## Shapes

- Radius `md` 6 px on buttons, inputs, panels and modals; `sm` 4 px on small controls; `full` on badges only.
- Not everything is a card. Lists are tables or plain rows with dividers; a bordered panel is used only to group a form or a summary.

## Components

Built on Nuxt UI (decision 20). Use its component for each job and theme it with these tokens.

### Buttons
- One primary button per screen or dialog (ink teal). Secondary is white with a `line-strong` border. Destructive actions use `debt` text and ask for confirmation.
- Height 40 px on desktop, 48 px on phones. Labels are verbs from the task: "Save lesson", "Record payment", "Send".

### Inputs and forms
- Label above the field, always visible. Helper text below in `ink-muted`.
- Errors appear under the field in `debt` with the CW1 wording, and the field border turns `debt`.
- Height 44 px; selects and date pickers match.

### Tables (administrator)
- Header row on `mist`, label style; rows 44 px (56 px when a row holds action buttons), `line` dividers, no zebra stripes.
- Row hover `mist`; selected row `ink-teal-wash`. Row actions on the right.

### Navigation
- Computer: Nuxt UI DashboardSidebar for every role, with the branch name, the role's sections, and at the bottom one row with the user's name and role and a menu button. The menu holds the language choice, phone or full view, Reset demo data and Sign out (decision 55).
- Phone: the sidebar becomes a menu behind a button next to the title; account screens add a bottom navigation (Home, Schedule, Attendance, Grades, Payments). The high-fi is one responsive website (decision 49).

### Badges
- Pill, caption size, text plus a tinted background, for statuses. The tint follows the meaning: good (Present, Paid, Completed) uses `paid`; needs attention (Late, Partly paid, Waiting list) uses `pending`; bad (Absent, Unpaid, Lost) uses `debt`; In progress uses `ink-teal`. The word is always there.

### Feedback
- Toast at the top on desktop and bottom on phones for confirmations ("Lesson saved at 14:05"), announced with `aria-live`.
- Offline banner on the lesson form in `pending` with plain words: "Offline: changes saved on this device".

### Signature component: enrolment stepper
- A horizontal stepper on desktop with the six FR-01 stages; each completed stage shows its result, date and person underneath. The current stage sits on `ink-teal-wash`.

### Charts

Charts answer a question a role has, from data the system already holds; none is decorative (decision 41). Method: the dataviz skill.
- **Forms:** bars for a few periods (attendance per month), a line with points for progress over assessments (grades), a meter for part of a whole (fee paid, collection), horizontal bars for stages (enrolment funnel).
- **Colour:** one sequential hue, ink teal. The current period is `ink-teal`; earlier periods use `chart-teal-mid` then `chart-teal-light`. The ramp passed the dataviz validator in ordinal mode on 26.11.2026 (monotone, one hue, light end 3.33:1 on white). Status colours only on a meter that shows a status, always with its word. The low-fi uses greyscale: `ink` for the current period, `line-strong` for earlier ones.
- **Marks:** thin marks; 4 px rounded data ends on the baseline; 2 px gaps between bars; recessive axis and gridlines in `line`. No gradients, no 3D, no dual axes.
- **Labels:** text in `ink` and `ink-muted`, never in the series colour. A direct value label on the current or last mark only. One series: no legend box; the title names it.
- **Takeaway:** one line above every chart, in words ("91% this month, up from 86% in October").
- **High-fi:** a hover tooltip on every bar and point, an `aria-label`, and a table view.

## Do's and Don'ts

### Do:
- Lead every screen with the answer the person came for (who owes, who is absent, what is next).
- Use real seed names, groups and amounts in the CW1 style (`EN-B1-07`, `500,000 so'm`).
- Keep the same component and position for the same job on every screen.
- Show empty, error and success states for every list and form.

### Don't:
- Cream or beige backgrounds, terracotta accents, gradient washes, glassmorphism.
- Identical rounded cards with the same soft shadow for every block of content.
- All-caps eyebrow labels, middle-dot meta strings ("A · B · C"), decorative numbering (01 / 02 / 03).
- Emoji as icons, illustrations that carry no information, motion that is not feedback.
- More than one primary button per view.
