# UI design and accessibility

Applies to both prototypes. The visual system (colours, type, spacing, components) is in [`DESIGN.md`](../../DESIGN.md); this rule covers how to use it well.

Sources: Nielsen's 10 usability heuristics; WCAG 2.2 level AA; Apple Human Interface Guidelines and Material Design for touch targets; Impeccable's anti-pattern list for the generated-design tells.

## Hierarchy

- One page title and one primary action per screen or dialog.
- Importance is shown by size, weight and position first; colour comes last.
- The answer the person came for is at the top: who owes, who is absent, what is next.
- Group related fields and actions; separate groups with space before adding lines or boxes.

## Consistency

- The same job uses the same component in the same place on every screen.
- Navigation does not move between screens of one role.
- Words match CW1 and [`writing-style.md`](writing-style.md): the same thing always has the same name.

## Space and type

- Spacing only from the 4/8-point scale in `DESIGN.md`.
- Type only from the `DESIGN.md` scale and weights. No new sizes for one screen.
- Paragraph lines stay under 75 characters.

## Accessibility (WCAG 2.2 AA)

- Text contrast at least 4.5:1, large text and control borders at least 3:1.
- Status is never shown by colour alone; add a word or an icon with a label.
- Touch targets on phone screens at least 44 by 44 px (the WCAG minimum is 24 by 24).
- Every input has a visible label; placeholders are examples, not labels.
- Focus is always visible; the order of focus follows the reading order.
- Messages that appear after an action are announced (`aria-live`).

## Choices

- A group of options is single choice unless the requirement allows several. Single choice: chips or a segmented control where selecting one clears the others. Several: checkboxes, so the difference is visible.
- Show the current choice clearly (filled chip, tick and text), and show what changes with it in the same place (for example the QR code when Payme or Click is chosen).

## States and feedback

- Every list has an empty state that says what to do next.
- Every form shows errors next to the field, in CW1 wording, and keeps what the person typed.
- Every action gives feedback within the same view ("Lesson saved at 14:05").
- Destructive or irreversible actions ask for confirmation and name what will happen.
- Offline and loading states are shown, never silent.

## Devices

- Teacher, parent and student screens are designed at 360 px first: one column, no sideways scrolling, primary action within thumb reach.
- Administrator screens are desktop: compact tables, but rows no lower than 40 px and text no smaller than 14 px for data.

## Avoid the generated look

Do not use: cream or beige backgrounds with terracotta accents; gradient washes; identical rounded cards with the same soft shadow for every block; all-caps or letter-spaced eyebrow labels; middle-dot meta strings ("A · B · C"); decorative numbering (01 / 02 / 03); emoji as icons; one word in a heading picked out in another colour or italic; motion that is not feedback.

## Heuristics checklist (used by `quality-review`)

1. Can the person tell where they are and what just happened?
2. Do words and order match the real task at ITmatic?
3. Can an action be undone, cancelled or withdrawn where CW1 allows it?
4. Is the same thing named and drawn the same way everywhere?
5. Are errors prevented (disabled until valid, confirmation) before they are reported?
6. Is everything needed visible, so nothing has to be remembered between screens?
7. Is the common path the shortest one?
8. Is anything on the screen there only for decoration?
9. Do error messages say what went wrong and how to fix it?
10. Is help needed? If so, the design is not finished.
