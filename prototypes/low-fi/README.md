# Low-fidelity prototype

A greyscale, interactive Figma prototype of the ITmatic student management system. Every button and row is linked, so the five main functions can be clicked through from start to finish.

## Links

| What | Link |
| --- | --- |
| Figma file | https://www.figma.com/design/aMZGoAy6fupTCqgm9lkhSw |
| Prototype (click-through, starts at S01 Login) | https://www.figma.com/proto/aMZGoAy6fupTCqgm9lkhSw/ITmatic-CW2-low-fi-prototype?node-id=6-7&starting-point-node-id=6%3A7 |

Sharing is set to "Anyone with the link can view". On 26.11.2026 the prototype link was opened in a browser that was not signed in to Figma, and F1 was clicked through from S01 to S03. After the later changes, S01, S01b, S08w and S10w were opened the same way, each through its own link. All 35 frames were also looked at one by one in Chrome, in the prototype view.

## How to use it

Open the prototype link. It starts at **S01 Login**. The demo sign-in buttons enter the system as an administrator, teacher or parent; the account screens show the parent's view. "Parent, browser" opens the same account screens at computer width (S08w to S14w), with a sidebar in place of the bottom bar. The Staff tab on S01 opens the staff sign-in (S01b). Two things are simpler than in the high-fi: the week arrows on the Schedule are drawn but do not change the week, and the sidebar shows the user's name and Sign out directly, where the high-fi has an account menu. Each flow also has its own starting point (F1 to F5) in the prototype's flow list. Error states show the message from the Coursework 1 requirements; their main button then continues as if the input had been corrected.

## Flows

| Flow | Requirement | Click path |
| --- | --- | --- |
| F1 | FR-01 Enrol a new student | S01 > S02 > S03 > S04 > S04e (error) > S04 > S04s > S03 |
| F2 | FR-02 Record a lesson | S01 > S06 > S07 > S07e (error) > S07s > S06 |
| F3 | FR-03 Report an absence | S01 > S08 > S09 > S10 > S10a > S10ae (error) > S10as > S10 |
| F4 | FR-04 Monthly debtors list | S01 > S02 > S05 > S05a > S05ae (error) > S05as > S05 > S05b > S05bs > S05 |
| F5 | FR-05 Student and parent account | S01 > S01e (error) > S08 > S09 > S11 > S12 > S09 > S13 > S09 > S14 |

The flows connect: the absence a parent reports in F3 appears as a badge on the teacher's lesson form (S07), and the payment recorded in F4 shows in the parent's account as "Partly paid, 200,000 so'm due" (S14).

## Frames (35)

| ID | Frame | Role |
| --- | --- | --- |
| S01 | Login | All |
| S01b | Login, staff (work phone and password) | Administrator, teacher |
| S01e | Login, number not registered (E-FR05-01) | All |
| S02 | Admin home | Administrator |
| S03 | Enrolments list | Administrator |
| S04 | Enrolment stepper | Administrator |
| S04e | Cannot add to group yet (E-FR01-02) | Administrator |
| S04s | Enrolment completed | Administrator |
| S05 | Debtors list | Administrator |
| S05a | Record call result | Administrator |
| S05ae | Record call result, date in the past (E-FR04-04) | Administrator |
| S05as | Call result saved | Administrator |
| S05b | Record payment | Administrator |
| S05bs | Payment recorded | Administrator |
| S06 | Today's lessons | Teacher |
| S07 | Lesson record form | Teacher |
| S07e | Students not marked (E-FR02-01) | Teacher |
| S07s | Lesson saved | Teacher |
| S08 | Child chooser | Parent |
| S09 | Account home | Parent, student |
| S10 | Schedule | Parent, student |
| S10a | Report absence | Parent |
| S10ae | Report absence, no reason (E-FR03-02) | Parent |
| S10as | Teacher informed | Parent |
| S11 | Attendance | Parent, student |
| S12 | Grades | Parent, student |
| S13 | Materials | Parent, student |
| S14 | Payments | Parent, student |
| S08w to S14w | The browser (1440 px) version of S08 to S14: Child chooser, Account home, Schedule with the week calendar, Attendance, Grades, Materials, Payments | Parent, student |

## Exports

One PNG per frame in [`exports/`](exports/), named by frame ID, for example `S07-lesson-record-form.png`. Exported from Figma on 26.11.2026. The 23 frames that were changed or added later that day (S01, S01b, S01e, S02 to S07, S09, S10, S10a, S10ae, S10as, S11, S13 and S08w to S14w) are at 1x; the others are at 2x.

Changed on 26.11.2026 after the high-fi was built: weekday names corrected (26.11.2026 is a Thursday), attendance figures corrected to 85%, 86% and 91%, a week calendar on S10, the Staff tab, and the browser frames.

Built on 26.11.2026 with a component kit (Components page) and the greyscale tokens of the design system.
