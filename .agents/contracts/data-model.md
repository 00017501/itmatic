# Data model contract

The entities and fields that the mocked data and the Vue app share. The UML class diagrams are drawn from this file, so it must match the app at all times.
Taken from the CW1 report `context/cw1-report.docx` (use cases, FR-01 to FR-05, sequence diagrams). Where this file and CW1 disagree, CW1 wins.

Status: **confirmed** by the user on 26.11.2026 (decision 46) and matched to `prototypes/high-fi/src/types.ts` on 26.11.2026, when the high-fi was finished. The app and this file change together.

Change rule: a field, entity or operation that changes in `prototypes/high-fi/src/types.ts` changes here in the same piece of work.

Conventions: ids are strings; dates are ISO strings in data and shown as DD.MM.YYYY; money is a whole number of so'm, never negative; months are `YYYY-MM`.

## Entities

| Entity | Fields | Source |
| --- | --- | --- |
| Branch | id, name | FR-04 main flow 3 |
| User | id, role, fullName, phone, language, branchId, studentId (set for a student login: the student record the account shows) | NFR-01, NFR-02, FR-05 |
| Student | id, fullName, age, phone, branchId, groupId, parentIds | UC-1, FR-05 |
| Course | id, name | Business case |
| Group | id, code, courseId, level, teacherId, branchId, type, capacity, monthlyFee, room, weekdays, startTime | FR-01 validation rules, FR-04 |
| Enquiry | id, studentName, age, studentPhone, parentName, parentPhone, courseId, createdAt | FR-01 preconditions |
| Enrolment | id, enquiryId, status, level, groupId, stages, lostReason, contractNumber, contractDate, contractScanName, studentId | FR-01 |
| EnrolmentStage | key, result, detail, date, responsibleUserId | FR-01 postconditions |
| Lesson | id, groupId, teacherId, date, startTime, room, state | FR-02 preconditions |
| LessonRecord | lessonId, topic, homework, attachmentNames, marks, savedAt, savedByUserId, savedOffline, sentAt | FR-02, NFR-03 |
| AttendanceMark | studentId, status, history | FR-02 main flow 3 |
| AttendanceChange (one entry of a mark's history) | status, changedAt | FR-02 alternative flows: a changed mark keeps its earlier value |
| AbsenceStatus | id, lessonId, studentId, kind, delayMinutes, reason, otherText, reportedByUserId, reportedVia, reportedAt, withdrawnAt | FR-03 |
| Payment | id, studentId, month, amount, method, status, invoiceNumber, qrPayload, recordedByUserId, recordedAt | UC-3, FR-04; QR for Payme and Click added 26.11.2026 (decision 39) |
| Discount | id, studentId, month, percent, type, approved | UC-3 extension 2a, FR-04 |
| CallResult | id, studentId, month, result, promisedDate, recordedByUserId, recordedAt | FR-04 main flow 5 |
| Grade | id, studentId, level, kind, score, published | FR-05 main flow 5 |

Derived, never stored:

| Derived | Calculated from | Source |
| --- | --- | --- |
| DebtorLine: studentId, studentName, groupCode, parentName, parentPhone, amountDue, unpaidMonths, lastPaymentDate, callResult | Enrolment, Group, Discount, Payment, CallResult | FR-04 main flow 3 |
| PaymentStatus: month, fee, paid, due, dueDate, status | Group, Discount, Payment | FR-05 main flow 7 |
| AttendanceSummary: month, lessons, attended, percentage | LessonRecord | FR-05 main flow 4 |
| LessonAttendance (one row of the summary): lessonId, date, status | LessonRecord, AttendanceMark | FR-05 main flow 4 |
| MonthlyAttendance: month, percentage (chart on S11) | LessonRecord, AttendanceMark | FR-05 main flow 4 |
| GradeProgress: level, kind, score, published scores only (chart on S12) | Grade | FR-05 main flow 5 |
| CollectionProgress: month, due, collected, percentage, for one branch (meter on S02; S14 shows the same for one student from PaymentStatus) | Group, Discount, Payment | FR-04, FR-05 main flow 7 |
| EnrolmentFunnelStep: step, count of applicants who reached it this month (chart on S02) | Enrolment, EnrolmentStage | FR-01 |

## Enumerations

Values are stored as the keys below and shown through translations in English, Russian and Uzbek (decision 46).

| Name | Values (stored key: label in English) | Source |
| --- | --- | --- |
| Role | administrator, teacher, parent, student | NFR-01, FR-05 |
| Language | en, ru, uz | NFR-02 |
| GroupType and capacity | standard 12, mini 4, individual 1 | FR-01 validation rules |
| EnrolmentStatus | inProgress: In progress; waitingList: Waiting list; completed: Completed; lost: Lost | FR-01 |
| StageKey, in order | levelTest, group, teacherConversation, trialLesson, feedback, contract | FR-01 main flow 2 to 7 |
| StageResult, level test | scored: score 0 to 100 with a level; skipped: with a reason, level is the course's first level | FR-01 |
| StageResult, group | assigned: Group chosen | FR-01 main flow 3 |
| StageResult, teacher conversation | accepted: Accepted; notSuitable: Not suitable | FR-01 main flow 4 |
| StageResult, trial lesson | attended: Attended; didNotAttend: Did not attend | FR-01 main flow 5 |
| StageResult, feedback | wantsToJoin: Wants to join; wantsAnotherGroup: Wants another group; declines: Declines | FR-01 main flow 6 |
| StageResult, contract | signed: Signed | FR-01 main flow 7 |
| LostReason | price, schedule, level, location, other | FR-01 alternative flows |
| LessonState | scheduled, cancelled | FR-02 preconditions |
| AttendanceStatus | present: Present; late: Late; absent: Absent | FR-02 main flow 3 |
| AbsenceKind | late: Late; absent: Absent | FR-03 main flow 2 |
| DelayMinutes | 5, 10, 15, 30, 60 | FR-03 main flow 2 |
| AbsenceReason | illness, family, travel, schoolExam: School exam, other | FR-03 main flow 2 |
| ReportedVia | parent, phone | FR-03 alternative flows |
| PaymentMethod | cash, card, payme: Payme, click: Click | FR-04 preconditions |
| PaymentRecordStatus | recorded (cash, card, or Payme and Click once confirmed); awaitingConfirmation (Payme, Click: QR shown) | Decision 39 |
| DiscountType | oneOff: one-off; bringAFriend: bring-a-friend | UC-3 extension 2a |
| CallResultKind | promisedBy: Promised by; noAnswer: No answer; leaving: Leaving | FR-04 main flow 5 |
| GradeKind | midterm, final | FR-05 main flow 5 |
| PaymentStatusKind | paid: Paid; partlyPaid: Partly paid; unpaid: Unpaid | FR-05 main flow 7 |

## Operations

These become the methods on the class diagrams.

| On | Operation | Rule | Source |
| --- | --- | --- | --- |
| Enrolment | recordStage(key, result, detail, level) | Stages in order; a skipped test counts as complete; keeps date and responsible user. Not suitable and Wants another group return the flow to choosing a group; Did not attend leaves the trial lesson open | FR-01 validation rules, E-FR01-01 |
| Enrolment | assignGroup(group) | Group matches course and level and has a free slot | FR-01 main flow 3, E-FR01-04 |
| Enrolment | addToWaitingList() | Status becomes Waiting list when no matching group has a free slot | FR-01 alternative flows |
| Enrolment | addToGroup() | Refused without a recorded contract; creates the student, the student and parent accounts | FR-01 main flow 8, E-FR01-02 |
| Enrolment | complete(contract) | Contract number is unique; scan is PDF, JPG or PNG; records the contract, then addToGroup(); the first fee month follows from the contract date | FR-01 main flow 7 and 8 |
| Enrolment | closeAsLost(reason) | Reason is mandatory | E-FR01-05 |
| LessonRecord | markAllPresent() | Fills only unmarked students; advance statuses stay | FR-02 main flow 3 |
| LessonRecord | save(lesson, draft) | Every student marked; topic 3 to 200 characters; homework up to 1,000; up to 3 files; one record per lesson; a changed mark keeps its history | FR-02 validation rules, E-FR02-01, E-FR02-02 |
| LessonRecord | setOffline(on) | A record saved offline is kept on the device and sent when the connection returns | NFR-03 |
| AbsenceStatus | report(lesson, student, kind, reason or delay) | Before the lesson starts; one per student per lesson; never replaces the teacher's mark | FR-03, E-FR03-01, E-FR03-02 |
| AbsenceStatus | withdraw() | Until the lesson starts; kept in history | FR-03 main flow 5 |
| Payment | record(student, month, amount, method) | Logs the administrator and the time; overpayment becomes credit for the next month | UC-3, FR-04 validation rules |
| Payment | createQrInvoice(student, month, amount, method) | Payme or Click only: makes an invoice number and a QR payload; the payment stays awaiting confirmation | Decision 39 |
| Payment | confirm() | The provider's confirmation makes the payment recorded (simulated in the prototype) | Decision 39 |
| Debtors | amountDue(student, month) | Group fee minus approved discounts minus recorded payments for that month; listed when above 0; no fee before the student's first fee month | FR-04 main flow 2 and 3 |
| Debtors | debtorLines(branch, month) | One line per student who owes; a broken promise comes first | FR-04 main flow 3 and 5 |
| Debtors | recordCallResult(student, month, result, date) | A promised date is after today | FR-04 main flow 5, E-FR04-04 |
| Debtors | collectionProgress(branch, month) | Fees due and collected for the branch | FR-04 |
| Account | paymentStatus(student, month) | Uses the same amountDue as the debtors list | FR-05 validation rules |
| Account | attendanceSummary(student, month), monthlyAttendance(student, months) | From lesson records | FR-05 main flow 4 |
| Account | visibleGrades(student) | Published grades only | FR-05 main flow 5 |
| Session | signInByPhone(phone, code), signInStaff(phone, password), signOut(), setLanguage(language) | Parents and students sign in by phone and SMS code; each role sees only its own screens | FR-05 main flow 1, NFR-01, NFR-02, E-FR05-01 |

Not in the prototype: `Enrolment.startFromEnquiry(enquiry)` (FR-01 main flow 1). The seed data already holds the enquiries with their enrolments, so no screen creates one.

## Seed data the flows need

- Two branches, one administrator, one teacher, one parent with two children, one student login.
- Groups named in the CW1 style, for example `EN-B1-07`, with a monthly fee of 500,000 so'm.
- One open enquiry for F1, one lesson today for F2 and F3, one student with a 500,000 so'm fee and no payment this month for F4 and F5, one published and one unpublished grade.
