# Screens and flows contract

The one list of screens, roles and navigation links. **Both prototypes follow it**: same IDs, same names, same links.
Traced to the CW1 report `context/cw1-report.docx`. Where this file and CW1 disagree, CW1 wins.

Status: screen list agreed with the user on 26.11.2026. Overlays, states, screen contents and account navigation agreed in the low-fi grilling on 26.11.2026 (decisions 28 to 36). Routes and the simulated parts were confirmed when the high-fi was built on 26.11.2026 (decisions 46 to 51).

Change rule: a screen, link or route that changes in either prototype changes here in the same piece of work, and then in the other prototype.

## Screens

Device: desktop means a wide frame (1440 px), phone means a 360 px wide frame (CW1 FR-02 acceptance criterion 1, NFR-04). The column gives the low-fi frame and the size the role mostly uses. The high-fi is one responsive website (decision 49): every screen works at both sizes, with a sidebar on wide screens and a menu button on phones.

| ID | Screen | Role | Device | Route | Traces to | Links out |
| --- | --- | --- | --- | --- | --- | --- |
| S01 | Login | All | Phone | `/login` | FR-05 main flow 1, NFR-01, NFR-02 | S01e, S01b (Staff tab), S02, S06, S08 (demo sign-in; no student demo in the low-fi, decision 33), S08w ("Parent, browser" in the low-fi); in the high-fi also S09 for a student or a parent with one child |
| S02 | Admin home | Administrator | Desktop | `/admin` | UC-1, FR-04 | S01, S03, S04, S05 (sidebar and rows) |
| S03 | Enrolments list | Administrator | Desktop | `/admin/enrolments` | FR-01, activity diagram | S01, S02, S04, S05 (sidebar and rows) |
| S04 | Enrolment stepper | Administrator | Desktop | `/admin/enrolments/:id` | FR-01 main flow 1 to 8, activity diagram | S01, S02, S03, S05 (sidebar), S04e, S04s |
| S05 | Debtors list | Administrator | Desktop | `/admin/debtors` | FR-04, sequence diagram 3, UC-3 | S01, S02, S03 (sidebar), S05a, S05b |
| S06 | Today's lessons | Teacher | Phone | `/teacher` | FR-02 main flow 1 | S01, S07 |
| S07 | Lesson record form | Teacher | Phone | `/teacher/lessons/:id` | FR-02, sequence diagram 1, NFR-03 | S06, S07e |
| S08 | Child chooser | Parent | Phone | `/account` | FR-05 main flow 2 | S01, S09 |
| S09 | Account home | Parent, student | Phone | `/account/:studentId` | FR-05 main flow 3, sequence diagram 4 | S01, S08, S10, S11, S12, S14 (bar), S13, S10a |
| S10 | Schedule and Report absence | Parent, student | Phone | `/account/:studentId/schedule` | FR-03, sequence diagram 2, FR-05 main flow 8 | S09, S11, S12, S14 (bar), S13 (from a lesson), S10a |
| S11 | Attendance | Parent, student | Phone | `/account/:studentId/attendance` | FR-05 main flow 4 | S09, S10, S12, S14 (bar) |
| S12 | Grades | Parent, student | Phone | `/account/:studentId/grades` | FR-05 main flow 5 | S09, S10, S11, S14 (bar) |
| S13 | Materials | Parent, student | Phone | `/account/:studentId/materials` | FR-05 main flow 6 | S09 (back), S09, S10, S11, S12, S14 (bar) |
| S14 | Payments | Parent, student | Phone | `/account/:studentId/payments` | FR-05 main flow 7 | S09, S10, S11, S12 (bar) |

S09 to S14 share one bottom navigation bar with five tabs: Home, Schedule, Attendance, Grades, Payments (decision 30). Materials (S13) opens from Home and from each lesson in Schedule. Only a parent sees Report absence (FR-03 actors).

### Overlays and states

Overlays and states belong to their screen and do not count as screens. The low-fi also keeps a browser version of each parent and student screen, named with the suffix `w` (`S08w` to `S14w`, decision 54); it is the same screen at 1440 px, with the sidebar in place of the bottom bar. In the low-fi each is its own frame named with a letter suffix: `a`, `b` for overlays, `e` for an error state, `s` for a confirmation (decisions 28 and 31).

| ID | Overlay or state | On | Shows | Traces to |
| --- | --- | --- | --- | --- |
| S01e | Error state | S01 | Phone field with "This number is not registered at ITmatic. Please contact your branch administrator." | E-FR05-01 |
| S01b | Staff sign-in | S01 | The Staff tab: work phone number and password; Sign in opens S02. The Parents and students tab returns to S01 | Decision 50, NFR-01 |
| S04e | Error dialog | S04 | After "Add to group" before the contract: "This applicant cannot join a group until a signed contract is recorded." | E-FR01-02 |
| S04s | Confirmation | S04 | "Enrolment completed": student added to EN-B1-07, student and parent accounts created, first month's fee due | FR-01 main flow 8 |
| S05e | Access refused (high-fi only, route `/no-access`) | Any screen of another role | "You do not have access to payment information." for the debtors list; a general message for other screens; a link back to the role's own home | E-FR04-03, NFR-01 |
| S05a | Record call result | S05 | Student and amount; Promised by (date), No answer, Leaving; Save, Cancel | FR-04 main flow 5 |
| S05ae | Error state | S05a | Promised date 25.11.2026 with "Choose a promised payment date after today." | E-FR04-04 |
| S05as | Confirmation | S05a | "Call result saved": promised by 29.11.2026; a broken promise moves the line to the top | FR-04 main flow 5, alternative flow "Broken promise" |
| S05b | Record payment | S05 | Aliyeva Malika, November 2026, amount 300,000, method Cash, Card, Payme, Click (single choice); choosing Payme or Click shows a scannable QR code for invoice INV-2026-11-0412 with the amount; "Remaining after payment: 200,000 so'm"; Record payment, Cancel | UC-3 basic flow, FR-04 main flow 6 |
| S05bs | Confirmation | S05 | "Payment recorded. 200,000 so'm still due." | FR-04 main flow 6, alternative flow "Partial payment" |
| S07e | Error dialog | S07 | "Mark attendance for all students before saving (not marked: …)"; offers Mark them present and save | E-FR02-01 |
| S07s | Confirmation | S07 | "Lesson saved at 09:05" (the CW1 example says 14:05; the seed lesson is at 09:00) | FR-02 main flow 5 |
| S10a | Report absence | S10 | Late with delay 5, 10, 15, 30, 60 minutes, or Absent with reason illness, family, travel, school exam, other; Send, Cancel | FR-03 main flow 2 and 3 |
| S10ae | Error state | S10a | Reason list with "Choose a reason for the absence." | E-FR03-02 |
| S10as | Confirmation | S10a | "The teacher has been informed"; can be withdrawn until the lesson starts | FR-03 main flow 5 |

F4 in the low-fi shows E-FR04-04 (S05ae); E-FR04-03 (access refused for other roles) is shown in the high-fi only, because no other role can click through to the debtors list (decision 32). Error states show the error, and their main action continues as if the input had been corrected.

## Screen contents (agreed 26.11.2026, decision 29)

Seed story used by both prototypes: parent Aliyeva Dilnoza has two children, Malika (EN-B1-07) and Timur (IT-PY-02). Malika is absent today, 26.11.2026, with illness, reported by her parent at 08:42. Malika's November fee is 500,000 so'm; 300,000 so'm is recorded in F4, leaving 200,000 so'm due, which S14 shows. Applicant Karimov Sardor is at the contract stage of enrolment. Chart data (decision 41): Malika's attendance Sep 85%, Oct 86%, Nov 91% (decision 47; November is 100% of 10 lessons until today's absence is saved in F2); her grades A1 final 74/100, A2 final 81/100, B1 midterm 78/100; branch collection for November 41,800,000 of 51,000,000 so'm (82%); enrolments this month reaching each stage: enquiry 14, level test 11, group 9, teacher conversation 8, trial lesson 7, contract 5.

| Screen | Main content | Primary action |
| --- | --- | --- |
| S01 | ITmatic wordmark, language switch (EN, RU, UZ), phone and 6-digit code, demo links for each role. High-fi (decision 50): two tabs, Parents and students (phone and SMS code) and Staff (work phone and password), and a list of demo accounts | Sign in |
| S02 | Sidebar; today at the branch: enquiries in progress, debtors list total (23 students, 9,200,000 so'm), lessons missing attendance; fee collection meter for November (41,800,000 of 51,000,000 so'm); enrolment funnel chart (applicants reaching each of the six stages) | Open debtors list |
| S03 | Enrolments table with tabs In progress, Waiting list, Completed, Lost | Open an enrolment row |
| S04 | Six-stage stepper, stages 1 to 5 done with result, date and person; contract stage open with number, date and scan file name. High-fi: every stage has its form, so an applicant can be taken from the level test to the contract; Close as lost asks for the refusal reason (E-FR01-05); a full group offers the waiting list (E-FR01-04) | Complete enrolment |
| S05 | Debtors list for November 2026 with totals; student, group, parent, phone, amount due, last payment, call result; row actions | Record payment |
| S06 | Today, Thursday 26.11.2026: two lessons (EN-B1-07 at 09:00, EN-A2-04 at 14:00); the 09:00 card notes "Absences reported: 1" once F3 is done; a form opens 15 minutes before its lesson | Open the lesson |
| S07 | Group students with Present, Late, Absent; Malika shows "Absent: illness (parent, 08:42)"; Mark all present; topic; homework | Save lesson |
| S08 | Choose a child: Malika and Timur | Open a child |
| S09 | Next lesson (date, time, room, teacher); this month's attendance; payment status | Report absence |
| S10 | The next lesson with Report absence; a week calendar (decision 53): days across and hours down on a wide screen, one row per day on a phone, each lesson with time, course, room and attendance status, previous and next week (the arrows are not linked in the low-fi, decision 56); earlier lessons with a link to their materials | Report absence |
| S11 | Attendance this month, 91% once today's absence is saved in F2 (10 of 11 lessons; 100% of 10 before); bar chart of attendance per month (Sep 85%, Oct 86%, Nov 91%); each lesson's status | none |
| S12 | Grades: line chart of published scores across levels (A1 final 74, A2 final 81, B1 midterm 78); B1 midterm 78/100; final "Not published yet" | none |
| S13 | Materials: each lesson's topic, homework and files | none |
| S14 | Payments: meter 300,000 of 500,000 so'm paid; "Partly paid, 200,000 so'm due"; fee breakdown; history | none |

## Flows

One happy path per requirement, plus the error messages listed. Message wording comes from the CW1 error tables.

| ID | Flow | Click path | Shown result | Error shown |
| --- | --- | --- | --- | --- |
| F1 | Enrol a new student (FR-01) | S01 as administrator → S02 → S03 → open an enquiry → S04: level test → group → teacher conversation → trial lesson → feedback → contract → Complete → S03 | Status Completed; student in the group; student and parent accounts exist; first month's fee due | E-FR01-02 |
| F2 | Record a lesson (FR-02) | S01 as teacher → S06 → S07: advance status badge visible → Mark all present → topic → homework → Save → S06 | "Lesson saved at 09:05" (CW1 example: 14:05); record visible in the account (S11, S13) | E-FR02-01 |
| F3 | Report an absence (FR-03) | S01 as parent → S08 → S09 → S10 → Report absence → S10a: Absent, reason → Send | "The teacher has been informed"; badge appears on S07 for the teacher | E-FR03-02 |
| F4 | Monthly debtors list (FR-04) | S01 as administrator → S02 → S05 → S05a call result (S05ae error, S05as saved) → S05b payment of 300,000 so'm | Line drops from 500,000 to 200,000 so'm; line disappears when nothing is due | E-FR04-04 on S05ae (low-fi); E-FR04-03 for any other role (high-fi) |
| F5 | Personal account (FR-05) | S01 with phone and SMS code (S01e error first in the low-fi) → S08 if several children → S09 → S11 → S12 → S09 (Home) → S13 → S09 → S14 | "Partly paid, 200,000 so'm due"; unpublished grades hidden | E-FR05-01 |

Two links between flows are worth keeping, because they show one system and not five demos: the status sent in F3 appears in F2, and the payment recorded in F4 appears in F5.

## Non-functional requirements shown

| NFR | Shown as | Where |
| --- | --- | --- |
| NFR-01 Role-based data access | A login per role; each role reaches only its own screens; teachers see no phone numbers or payment data | S01, route guards, S07 |
| NFR-02 Interface languages | Switch between English, Russian and Uzbek (Latin), remembered after reload; dates DD.MM.YYYY, currency so'm | S01, header |
| NFR-03 Offline attendance entry | Offline banner on the form; the record is saved on the device and shows both the recorded and the sent time | S07 |
| NFR-04 Mobile usability | One website for PCs and phones: every screen works at 360 px without turning the phone and at 1440 px (decision 49) | S01 to S14 |
| NFR-05 Scalability | Not shown. Branches exist in the data only. | none |

## Simulated in the prototype

Everything the high-fi fakes is listed here. Nothing is faked silently.

| Simulated | How | CW1 behaviour it stands in for |
| --- | --- | --- |
| Staff login | Staff tab on S01: the work phone and any password; a list of demo accounts signs in with one click (decision 50) | Not specified in CW1; NFR-01 only says every user type is authorised |
| SMS code | Any 6 digits are accepted for a registered phone number | FR-05 main flow 1 |
| Date and time | The date is fixed at 26.11.2026; the time is set at sign-in (parent and student 08:42, teacher 09:05, administrator 10:12), so the demo gives the same result on any day | whole system |
| Scheduled job on the 1st at 08:00 | The list is calculated when S05 opens | FR-04 main flow 1 |
| Contract scan and attachments | File name only, nothing uploaded | FR-01 main flow 7, FR-02 main flow 4 |
| Connection loss | An offline switch in the app | NFR-03 |
| Notifications | In-app message only | FR-03 main flow 4, FR-04 main flow 4 |
| Backend | Seed data and local storage | whole system |
| Phone view | "Switch to phone view" in the account menu shows the same website in a phone-sized frame inside the browser window (decision 52) | NFR-04 |
| Payme and Click payments | The QR code encodes a demo invoice reference marked "NOT A REAL PAYMENT"; the provider's confirmation arrives by itself after about two seconds | Decision 39 |
| First fee month | A contract signed after the 20th makes the next month the first fee month. This is an assumption of the prototype; CW1 only says the first month's fee becomes due | FR-01 main flow 8 |

## Out of scope for both prototypes

UC-4 Handle Teacher Absence, the waiting list beyond setting the status (nobody is told when a place opens), creating a new enquiry (the seed holds them), the lost-applicant follow-up list, correction requests after 23:59, several-day absences, discounts approval, receipts and the director's totals view. They stay in CW1 and are not built unless the user asks.
