# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Decided before init and recorded in `.agents/contracts/decisions.md` (rows 1, 8, 10, 15, 20): Vue 3 with `<script setup lang="ts">`, Vite, Vue Router with hash routing, Pinia, Tailwind, vue-i18n and Nuxt UI v4. No real backend; seed data and local storage. Deployed on GitHub Pages under `/itmatic/`. The low-fi is a separate, greyscale, interactive Figma file.

## Users

ITmatic's own users come first. When they and the marker pull in different directions, design for real daily use at ITmatic (decision 25).

- **Administrator** (desktop, front desk of a branch): runs enrolment from enquiry to signed contract, and chases monthly payments by phone from the debtors list.
- **Teacher** (phone, in the classroom): opens today's lessons and records attendance, topic and homework for a group, sometimes with a poor connection. Sees absence reasons before the lesson starts.
- **Parent** (phone): reports a child's lateness or absence, and checks schedule, attendance, grades, materials and payments, possibly for more than one child.
- **Student** (phone): checks their own schedule, attendance, grades, materials and payment status.

Secondary audience: the coursework marker. They do not run the app. They see a video of at most one minute, screenshots in the Word report and public links. Every screen must read clearly as a still screenshot and within a few seconds of video.

## Product Purpose

A student management system for ITmatic, a private education centre in Tashkent with two branches, 30 to 40 staff and over 200 English students. It covers five CW1 requirements: enrolment (FR-01), lesson records (FR-02), absence reporting (FR-03), the monthly debtors list (FR-04) and the personal account for parents and students (FR-05).

Success: each of the five flows in `.agents/contracts/screens-and-flows.md` can be completed end to end on the happy path, and two links between flows show one system rather than five demos (an absence reported in F3 appears for the teacher in F2; a payment recorded in F4 appears in the account in F5).

## Positioning

One system that replaces the copies in Google Sheets, Telegram and paper: the teacher knows the absence reason before the lesson, the debtors list builds itself, and a parent sees attendance, grades, materials and payments in one account. (CW1 business case, "Problems identified"; confirmed by the user on 26.11.2026.)

## Operating Context

- Enquiries arrive through Instagram, Telegram, phone calls and visits. Enrolment runs through a level test, group choice, a conversation with the teacher, a free trial lesson, feedback and a signed paper contract.
- Groups: standard up to 12, mini up to 4, individual 1. Fees are paid monthly in advance, in so'm.
- Today, teachers write attendance in an online spreadsheet, absence reasons reach the teacher late, results go to Telegram groups or stay on paper, and administrators remind debtors by hand.
- CW1 research: 80% of students and parents communicate by phone; 75% do not tell the teacher about an absence directly; a personal account scored 4.3 out of 5.
- Interface in English, Russian and Uzbek (Latin) (NFR-02). Dates DD.MM.YYYY, amounts like `500,000 so'm`, phones `+998 XX XXX XX XX`.

## Capabilities and Constraints

- Screens, routes, overlays, flows and what is simulated: `.agents/contracts/screens-and-flows.md` (14 screens, S01 to S14).
- Entities and fields: `.agents/contracts/data-model.md`.
- Requirements, marks and penalties: `.agents/contracts/brief.md`. Nothing outside it is a requirement.
- Role-based access (NFR-01): each role reaches only its own screens; teachers see no phone numbers or payment data.
- Offline attendance entry (NFR-03) is shown with an offline switch; the record keeps both the recorded and the sent time.
- Administrator screens are desktop; teacher, parent and student screens work at 360 px (NFR-04).
- Terms come from CW1: administrator, teacher, parent, student, enquiry, enrolment, group, lesson, debtors list, so'm. Error messages use the CW1 wording.
- Out of scope: teacher absence handling (UC-4), the waiting list, lost-applicant follow-up, corrections after 23:59, multi-day absences, discount approval, receipts, the director's totals.
- Open: staff login is not specified in CW1 (role picker on S01 until decided, Q2).

## Brand Commitments

- The name "ITmatic" appears as a plain text wordmark only. No logo, and nothing copied from ITmatic's Instagram or website (decision 26).
- British spelling and plain, short wording (`.agents/rules/writing-style.md`).

## Evidence on Hand

- CW1 group report: `context/cw1-report.docx` (business case, use cases, requirements, interview and questionnaire findings). Read-only, never published.
- Seed data is invented in the CW1 style (group codes like `EN-B1-07`). It is not real ITmatic data, and no real student, parent or staff name may be used.
- There are no testimonials, real metrics or logo files. Do not invent them.

## Product Principles

1. The answer first: each screen opens on what the person came for (who owes, who is absent, what is next).
2. One system, not five demos: data entered in one flow shows up where another role needs it.
3. Phones for people on the move, desktop for the front desk.
4. Honest prototype: everything faked is listed in the contract, and nothing is faked silently.
5. Use the CW1 words and messages, so the prototypes trace to the report.

## Accessibility & Inclusion

WCAG 2.2 AA (`.agents/rules/ui-design.md`). Three interface languages, so labels must fit Russian and Uzbek text lengths. Touch targets at least 44 by 44 px on phone screens.
