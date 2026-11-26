// Deterministic seed data for the prototype. No randomness, so every reset gives the same demo.
// The story follows .agents/contracts/screens-and-flows.md (decision 29, corrected by decision 47).
import type {
  AttendanceMark,
  AttendanceStatus,
  Enquiry,
  Enrolment,
  EnrolmentStage,
  Group,
  Lesson,
  LessonRecord,
  Payment,
  PaymentMethod,
  SeedData,
  StageKey,
  StageResult,
  Student,
  User,
} from '@/types'

export const DEMO_DATE = '2026-11-26'
export const DEMO_MONTH = '2026-11'
export const HOME_BRANCH_ID = 'b-chilonzor'

export const ADMIN_ID = 'u-admin'
export const TEACHER_ID = 'u-teacher'
export const TEACHER_IT_ID = 'u-teacher-it'
export const PARENT_ID = 'u-parent-aliyeva'
export const STUDENT_USER_ID = 'u-student-malika'
export const MALIKA_ID = 's-malika'
export const TIMUR_ID = 's-timur'

const SURNAMES = [
  'Abdullayev',
  'Karimov',
  'Rakhimov',
  'Yusupov',
  'Tursunov',
  'Ergashev',
  'Nazarov',
  'Saidov',
  'Mirzayev',
  'Rashidov',
  'Xasanov',
  'Ismoilov',
  'Qodirov',
  'Umarov',
  'Sharipov',
  'Tojiboyev',
  'Normatov',
  'Hamidov',
  'Sobirov',
  'Jurayev',
]
const MALE_NAMES = [
  'Jahongir',
  'Aziz',
  'Bekzod',
  'Doniyor',
  'Otabek',
  'Jasur',
  'Sardor',
  'Sherzod',
  'Bobur',
  'Ulugbek',
  'Farrukh',
  'Rustam',
  'Akmal',
  'Dilshod',
  'Javohir',
  'Sanjar',
]
const FEMALE_NAMES = [
  'Shahzoda',
  'Kamila',
  'Nilufar',
  'Sevara',
  'Madina',
  'Zarina',
  'Mohira',
  'Shahnoza',
  'Dildora',
  'Sabina',
  'Gulnora',
  'Feruza',
  'Lola',
  'Nodira',
  'Dilnoza',
  'Munisa',
]

function personName(index: number, female: boolean): string {
  const surname = SURNAMES[(index * 7) % SURNAMES.length] ?? 'Karimov'
  const names = female ? FEMALE_NAMES : MALE_NAMES
  const first = names[(index * 5) % names.length] ?? 'Aziz'
  return `${surname}${female ? 'a' : ''} ${first}`
}

function phone(index: number): string {
  const a = 90 + (index % 10)
  const b = String(100 + ((index * 37) % 900))
  const c = String(10 + ((index * 13) % 90))
  const d = String(10 + ((index * 29) % 90))
  return `+998 ${a} ${b} ${c} ${d}`
}

interface GroupPlan {
  group: Group
  /** Named students placed first: [student name, parent name, parent phone, student id?, parent id?]. */
  named: { name: string; parent: string; parentPhone: string; id?: string; parentId?: string }[]
  size: number
  /** Amounts still owed for November, applied to the students after the named ones. */
  generatedDebts: number[]
}

function group(
  id: string,
  code: string,
  courseId: string,
  level: string,
  teacherId: string,
  monthlyFee: number,
  room: string,
  weekdays: number[],
  startTime: string,
  branchId = HOME_BRANCH_ID,
): Group {
  return {
    id,
    code,
    courseId,
    level,
    teacherId,
    branchId,
    type: 'standard',
    capacity: 12,
    monthlyFee,
    room,
    weekdays,
    startTime,
  }
}

const TUE_THU_SAT = [2, 4, 6]
const MON_WED_FRI = [1, 3, 5]

const GROUP_PLANS: GroupPlan[] = [
  {
    group: group(
      'g-en-b1-07',
      'EN-B1-07',
      'c-english',
      'B1',
      TEACHER_ID,
      500_000,
      'Room 3',
      TUE_THU_SAT,
      '09:00',
    ),
    named: [
      {
        name: 'Aliyeva Malika',
        parent: 'Aliyeva Dilnoza',
        parentPhone: '+998 90 123 45 67',
        id: MALIKA_ID,
        parentId: PARENT_ID,
      },
      {
        name: 'Abdullayev Jahongir',
        parent: 'Abdullayeva Zarina',
        parentPhone: '+998 91 320 14 55',
      },
      { name: 'Mirzayeva Shahzoda', parent: 'Mirzayev Rustam', parentPhone: '+998 93 771 20 36' },
      { name: 'Rashidov Aziz', parent: 'Rashidova Mohira', parentPhone: '+998 94 245 61 18' },
      { name: 'Saidova Kamila', parent: 'Saidov Akmal', parentPhone: '+998 95 508 33 72' },
      { name: 'Tursunov Bekzod', parent: 'Tursunova Sabina', parentPhone: '+998 97 614 82 09' },
      { name: 'Yusupova Nilufar', parent: 'Yusupov Dilshod', parentPhone: '+998 98 137 45 90' },
      { name: 'Xasanov Doniyor', parent: 'Xasanova Munisa', parentPhone: '+998 99 402 76 31' },
    ],
    size: 11,
    generatedDebts: [],
  },
  {
    group: group(
      'g-en-a2-04',
      'EN-A2-04',
      'c-english',
      'A2',
      TEACHER_ID,
      500_000,
      'Room 5',
      TUE_THU_SAT,
      '14:00',
    ),
    named: [
      { name: 'Nazarov Otabek', parent: 'Nazarova Feruza', parentPhone: '+998 99 876 54 32' },
    ],
    size: 12,
    generatedDebts: [250_000, 250_000],
  },
  {
    group: group(
      'g-en-a1-02',
      'EN-A1-02',
      'c-english',
      'A1',
      'u-teacher-en2',
      500_000,
      'Room 2',
      MON_WED_FRI,
      '10:00',
    ),
    named: [],
    size: 12,
    generatedDebts: [500_000, 500_000, 500_000, 500_000, 500_000],
  },
  {
    group: group(
      'g-en-b2-03',
      'EN-B2-03',
      'c-english',
      'B2',
      'u-teacher-en2',
      500_000,
      'Room 2',
      MON_WED_FRI,
      '16:00',
    ),
    named: [],
    size: 12,
    generatedDebts: [500_000, 500_000, 500_000, 500_000, 500_000],
  },
  {
    group: group(
      'g-ielts-03',
      'IELTS-03',
      'c-ielts',
      'B2',
      'u-teacher-en2',
      650_000,
      'Room 4',
      TUE_THU_SAT,
      '17:00',
    ),
    named: [
      { name: 'Ergasheva Sevara', parent: 'Ergashev Bobur', parentPhone: '+998 97 111 22 33' },
    ],
    size: 10,
    generatedDebts: [],
  },
  {
    group: group(
      'g-it-py-02',
      'IT-PY-02',
      'c-it',
      'Python',
      TEACHER_IT_ID,
      600_000,
      'Room 6',
      MON_WED_FRI,
      '14:00',
    ),
    named: [
      {
        name: 'Aliyev Timur',
        parent: 'Aliyeva Dilnoza',
        parentPhone: '+998 90 123 45 67',
        id: TIMUR_ID,
        parentId: PARENT_ID,
      },
      { name: 'Tursunov Jasur', parent: 'Tursunova Gulnora', parentPhone: '+998 93 456 78 90' },
    ],
    size: 10,
    generatedDebts: [],
  },
  {
    group: group(
      'g-ru-a1-01',
      'RU-A1-01',
      'c-russian',
      'A1',
      'u-teacher-ru',
      450_000,
      'Room 1',
      TUE_THU_SAT,
      '11:00',
    ),
    named: [],
    size: 12,
    generatedDebts: [100_000, 100_000, 100_000],
  },
  {
    group: group(
      'g-ma-k1-05',
      'MA-K1-05',
      'c-mental',
      'K1',
      'u-teacher-ma',
      400_000,
      'Room 7',
      MON_WED_FRI,
      '15:00',
    ),
    named: [],
    size: 12,
    generatedDebts: [400_000, 400_000, 400_000, 400_000],
  },
  {
    group: group(
      'g-tr-a1-01',
      'TR-A1-01',
      'c-turkish',
      'A1',
      'u-teacher-ru',
      400_000,
      'Room 1',
      MON_WED_FRI,
      '18:00',
    ),
    named: [],
    size: 12,
    generatedDebts: [],
  },
  {
    group: group(
      'g-yu-en-a1-01',
      'YU-EN-A1-01',
      'c-english',
      'A1',
      'u-teacher-en2',
      500_000,
      'Room 1',
      TUE_THU_SAT,
      '10:00',
      'b-yunusobod',
    ),
    named: [],
    size: 3,
    generatedDebts: [],
  },
]

/** What the named debtors still owe for November. */
const NAMED_DEBTS: Record<string, number> = {
  'Aliyeva Malika': 500_000,
  'Tursunov Jasur': 400_000,
  'Ergasheva Sevara': 650_000,
  'Nazarov Otabek': 250_000,
}
const NAMED_LAST_PAYMENT: Record<string, string> = {
  'Aliyeva Malika': '2026-10-01',
  'Tursunov Jasur': '2026-10-03',
  'Ergasheva Sevara': '2026-10-02',
  'Nazarov Otabek': '2026-10-30',
}

const METHODS: PaymentMethod[] = ['cash', 'card', 'payme', 'click']

function isoDates(from: string, to: string, weekdays: number[]): string[] {
  const out: string[] = []
  const end = new Date(`${to}T00:00:00Z`).getTime()
  for (let t = new Date(`${from}T00:00:00Z`).getTime(); t <= end; t += 86_400_000) {
    const d = new Date(t)
    if (weekdays.includes(d.getUTCDay())) out.push(d.toISOString().slice(0, 10))
  }
  return out
}

function stage(
  key: StageKey,
  result: StageResult,
  detail: string,
  date: string,
  responsibleUserId = ADMIN_ID,
): EnrolmentStage {
  return { key, result, detail, date, responsibleUserId }
}

export function buildSeed(): SeedData {
  const users: User[] = [
    {
      id: ADMIN_ID,
      role: 'administrator',
      fullName: 'Karimova Nodira',
      phone: '+998 90 700 10 10',
      language: 'en',
      branchId: HOME_BRANCH_ID,
      studentId: null,
    },
    {
      id: TEACHER_ID,
      role: 'teacher',
      fullName: 'Saidova Dilfuza',
      phone: '+998 90 700 20 20',
      language: 'en',
      branchId: HOME_BRANCH_ID,
      studentId: null,
    },
    {
      id: TEACHER_IT_ID,
      role: 'teacher',
      fullName: 'Tursunov Anvar',
      phone: '+998 90 700 30 30',
      language: 'en',
      branchId: HOME_BRANCH_ID,
      studentId: null,
    },
    {
      id: 'u-teacher-en2',
      role: 'teacher',
      fullName: 'Ismoilova Barno',
      phone: '+998 90 700 40 40',
      language: 'en',
      branchId: HOME_BRANCH_ID,
      studentId: null,
    },
    {
      id: 'u-teacher-ru',
      role: 'teacher',
      fullName: 'Petrova Irina',
      phone: '+998 90 700 50 50',
      language: 'ru',
      branchId: HOME_BRANCH_ID,
      studentId: null,
    },
    {
      id: 'u-teacher-ma',
      role: 'teacher',
      fullName: 'Qodirov Sanjar',
      phone: '+998 90 700 60 60',
      language: 'uz',
      branchId: HOME_BRANCH_ID,
      studentId: null,
    },
    {
      id: STUDENT_USER_ID,
      role: 'student',
      fullName: 'Aliyeva Malika',
      phone: '+998 90 765 00 11',
      language: 'en',
      branchId: HOME_BRANCH_ID,
      studentId: MALIKA_ID,
    },
  ]
  const students: Student[] = []
  const payments: Payment[] = []
  let personIndex = 1
  let paymentIndex = 1

  for (const plan of GROUP_PLANS) {
    const { group: g } = plan
    for (let i = 0; i < plan.size; i++) {
      const named = plan.named[i]
      const index = personIndex++
      const female = named ? named.name.split(' ')[0]?.endsWith('a') === true : index % 2 === 0
      const name = named?.name ?? personName(index, female)
      const studentId = named?.id ?? `s-${index}`
      const parentId = named?.parentId ?? `u-parent-${index}`
      if (!users.some((u) => u.id === parentId)) {
        const surname = name.split(' ')[0] ?? 'Karimov'
        users.push({
          id: parentId,
          role: 'parent',
          fullName:
            named?.parent ??
            `${surname} ${(female ? MALE_NAMES : FEMALE_NAMES)[(index * 3) % 16] ?? 'Aziz'}`,
          phone: named?.parentPhone ?? phone(index),
          language: 'uz',
          branchId: g.branchId,
          studentId: null,
        })
      }
      students.push({
        id: studentId,
        fullName: name,
        age: 10 + (index % 9),
        phone: phone(index + 500),
        branchId: g.branchId,
        groupId: g.id,
        parentIds: [parentId],
      })

      // October is paid in full by everyone; November depends on the debt plan.
      const debt = named
        ? (NAMED_DEBTS[named.name] ?? 0)
        : (plan.generatedDebts[i - plan.named.length] ?? 0)
      const octoberDay = named ? NAMED_LAST_PAYMENT[named.name] : undefined
      const method = METHODS[index % METHODS.length] ?? 'cash'
      payments.push({
        id: `p-${paymentIndex++}`,
        studentId,
        month: '2026-10',
        amount: g.monthlyFee,
        method: named?.name === 'Aliyeva Malika' ? 'click' : method,
        status: 'recorded',
        invoiceNumber: null,
        qrPayload: null,
        recordedByUserId: ADMIN_ID,
        recordedAt: `${octoberDay ?? `2026-10-0${1 + (index % 5)}`}T10:${String(10 + (index % 45))}:00`,
      })
      const novemberPaid = g.monthlyFee - debt
      if (novemberPaid > 0) {
        payments.push({
          id: `p-${paymentIndex++}`,
          studentId,
          month: DEMO_MONTH,
          amount: novemberPaid,
          method,
          status: 'recorded',
          invoiceNumber: null,
          qrPayload: null,
          recordedByUserId: ADMIN_ID,
          recordedAt: `2026-11-0${1 + (index % 5)}T11:${String(10 + (index % 45))}:00`,
        })
      }
    }
  }

  const groups = GROUP_PLANS.map((p) => p.group)

  // ---- Lessons and lesson records ----
  const lessons: Lesson[] = []
  const lessonRecords: LessonRecord[] = []
  const withHistory = ['g-en-b1-07', 'g-it-py-02']
  // Malika misses two lessons in September and two in October; she is late once in November.
  const malikaAbsent = ['2026-09-10', '2026-09-22', '2026-10-08', '2026-10-27']
  const malikaLate = ['2026-11-21']
  const recentTopics: Record<string, { topic: string; homework: string; files: string[] }> = {
    '2026-11-24': {
      topic: 'Present Perfect',
      homework: 'Exercises 1 to 3, page 40',
      files: ['present-perfect.pdf', 'exercises-p40.docx'],
    },
    '2026-11-21': {
      topic: 'Past Simple review',
      homework: 'A 120-word essay about last weekend',
      files: ['essay-task.pdf'],
    },
    '2026-11-19': { topic: 'Listening practice', homework: '', files: ['listening-unit-6.mp3'] },
  }

  for (const g of groups) {
    const history = withHistory.includes(g.id)
    const dates = isoDates(history ? '2026-09-01' : DEMO_DATE, '2026-12-05', g.weekdays)
    const members = students.filter((s) => s.groupId === g.id)
    dates.forEach((date, lessonNumber) => {
      const lessonId = `l-${g.code}-${date}`
      lessons.push({
        id: lessonId,
        groupId: g.id,
        teacherId: g.teacherId,
        date,
        startTime: g.startTime,
        room: g.room,
        state: 'scheduled',
      })
      const past = date < DEMO_DATE
      // The IT lesson of 25.11 has no record: it is the "missing attendance" example.
      const missing = g.id === 'g-it-py-02' && date === '2026-11-25'
      if (!history || !past || missing) return
      const marks: AttendanceMark[] = members.map((s, memberIndex) => {
        let status: AttendanceStatus =
          (lessonNumber * 3 + memberIndex * 5) % 17 === 0 ? 'absent' : 'present'
        if (s.id === MALIKA_ID) {
          status = malikaAbsent.includes(date)
            ? 'absent'
            : malikaLate.includes(date)
              ? 'late'
              : 'present'
        }
        return {
          studentId: s.id,
          status,
          history: [{ status, changedAt: `${date}T${g.startTime}:00` }],
        }
      })
      const recent = g.id === 'g-en-b1-07' ? recentTopics[date] : undefined
      const savedAt = `${date}T${g.startTime.slice(0, 2)}:05:00`
      lessonRecords.push({
        lessonId,
        topic:
          recent?.topic ??
          `Unit ${1 + Math.floor(lessonNumber / 3)}, lesson ${1 + (lessonNumber % 3)}`,
        homework: recent ? recent.homework : `Workbook page ${20 + lessonNumber}`,
        attachmentNames: recent?.files ?? [],
        marks,
        savedAt,
        savedByUserId: g.teacherId,
        savedOffline: false,
        sentAt: savedAt,
      })
    })
  }

  // ---- Enquiries and enrolments ----
  const enquiries: Enquiry[] = []
  const enrolments: Enrolment[] = []
  let enquiryIndex = 1
  const addEnrolment = (
    applicant: {
      name: string
      parent: string
      parentPhone: string
      courseId: string
      createdAt: string
    },
    data: Partial<Enrolment> & Pick<Enrolment, 'status' | 'stages'>,
  ): void => {
    const n = enquiryIndex++
    enquiries.push({
      id: `q-${n}`,
      studentName: applicant.name,
      age: 9 + (n % 10),
      studentPhone: phone(n + 800),
      parentName: applicant.parent,
      parentPhone: applicant.parentPhone,
      courseId: applicant.courseId,
      createdAt: applicant.createdAt,
    })
    enrolments.push({
      id: `e-${n}`,
      enquiryId: `q-${n}`,
      level: null,
      groupId: null,
      lostReason: null,
      contractNumber: null,
      contractDate: null,
      contractScanName: null,
      studentId: null,
      ...data,
    })
  }
  const generated = (n: number, createdAt: string, courseId = 'c-english') => {
    const female = n % 2 === 1
    const name = personName(n + 300, female)
    return {
      name,
      parent: `${name.split(' ')[0]} ${(female ? MALE_NAMES : FEMALE_NAMES)[n % 16]}`,
      parentPhone: phone(n + 300),
      courseId,
      createdAt,
    }
  }
  const fullStages = (date: string, groupCode: string, contract: string): EnrolmentStage[] => [
    stage('levelTest', 'scored', 'Score 58, level A2', date),
    stage('group', 'assigned', groupCode, date),
    stage('teacherConversation', 'accepted', '', date, TEACHER_ID),
    stage('trialLesson', 'attended', '', date, TEACHER_ID),
    stage('feedback', 'wantsToJoin', '', date),
    stage('contract', 'signed', contract, date),
  ]

  // This month: 14 enquiries. Funnel: 14 enquiries, 11 level tests, 9 groups, 8 teacher
  // conversations, 7 trial lessons, 5 contracts.
  addEnrolment(
    {
      name: 'Karimov Sardor',
      parent: 'Karimova Lola',
      parentPhone: '+998 91 234 56 78',
      courseId: 'c-english',
      createdAt: '2026-11-12',
    },
    {
      status: 'inProgress',
      level: 'B1',
      groupId: 'g-en-b1-07',
      stages: [
        stage('levelTest', 'scored', 'Score 64, level B1', '2026-11-14'),
        stage('group', 'assigned', 'EN-B1-07', '2026-11-15'),
        stage('teacherConversation', 'accepted', '', '2026-11-17', TEACHER_ID),
        stage('trialLesson', 'attended', '', '2026-11-20', TEACHER_ID),
        stage('feedback', 'wantsToJoin', '', '2026-11-21'),
      ],
    },
  )
  addEnrolment(
    {
      name: 'Yusupova Madina',
      parent: 'Yusupov Farrukh',
      parentPhone: '+998 94 310 22 41',
      courseId: 'c-ielts',
      createdAt: '2026-11-18',
    },
    {
      status: 'inProgress',
      level: 'B2',
      groupId: 'g-ielts-03',
      stages: [
        stage('levelTest', 'scored', 'Score 71, level B2', '2026-11-20'),
        stage('group', 'assigned', 'IELTS-03', '2026-11-21'),
        stage('teacherConversation', 'accepted', '', '2026-11-24', 'u-teacher-en2'),
      ],
    },
  )
  addEnrolment(
    {
      name: 'Rakhimov Bekzod',
      parent: 'Rakhimova Dildora',
      parentPhone: '+998 95 480 17 63',
      courseId: 'c-mental',
      createdAt: '2026-11-25',
    },
    { status: 'inProgress', stages: [] },
  )
  const completedGroups = ['EN-A1-02', 'EN-B2-03', 'RU-A1-01', 'MA-K1-05', 'TR-A1-01']
  completedGroups.forEach((code, i) => {
    const day = String(3 + i * 2).padStart(2, '0')
    const g = groups.find((x) => x.code === code)
    const member = students.filter((s) => s.groupId === g?.id)[11 - i]
    addEnrolment(generated(i + 1, `2026-11-${day}`, g?.courseId), {
      status: 'completed',
      level: g?.level ?? null,
      groupId: g?.id ?? null,
      stages: fullStages(
        `2026-11-${String(8 + i * 2).padStart(2, '0')}`,
        code,
        `C-2026-04${String(i + 5).padStart(2, '0')}`,
      ),
      contractNumber: `C-2026-04${String(i + 5).padStart(2, '0')}`,
      contractDate: `2026-11-${String(8 + i * 2).padStart(2, '0')}`,
      contractScanName: `contract-C-2026-04${String(i + 5).padStart(2, '0')}.pdf`,
      studentId: member?.id ?? null,
    })
  })
  addEnrolment(generated(11, '2026-11-05'), {
    status: 'lost',
    level: 'A2',
    groupId: 'g-en-a2-04',
    lostReason: 'price',
    stages: [
      stage('levelTest', 'scored', 'Score 52, level A2', '2026-11-06'),
      stage('group', 'assigned', 'EN-A2-04', '2026-11-07'),
      stage('teacherConversation', 'accepted', '', '2026-11-10', TEACHER_ID),
      stage('trialLesson', 'attended', '', '2026-11-12', TEACHER_ID),
      stage('feedback', 'declines', '', '2026-11-13'),
    ],
  })
  addEnrolment(generated(12, '2026-11-09'), {
    status: 'lost',
    level: 'A1',
    groupId: 'g-en-a1-02',
    lostReason: 'schedule',
    stages: [
      stage('levelTest', 'skipped', 'Complete beginner', '2026-11-10'),
      stage('group', 'assigned', 'EN-A1-02', '2026-11-11'),
    ],
  })
  for (const n of [13, 14]) {
    addEnrolment(generated(n, `2026-11-${10 + n}`, 'c-it'), {
      status: 'waitingList',
      level: 'Beginner',
      stages: [stage('levelTest', 'skipped', 'Complete beginner', `2026-11-${11 + n}`)],
    })
  }
  addEnrolment(generated(15, '2026-11-16'), { status: 'lost', lostReason: 'location', stages: [] })
  addEnrolment(generated(16, '2026-11-19'), { status: 'lost', lostReason: 'price', stages: [] })

  // Earlier months, so the tabs read In progress 3, Waiting list 5, Completed 41, Lost 7.
  for (let n = 0; n < 3; n++) {
    addEnrolment(generated(20 + n, `2026-10-${10 + n * 4}`, 'c-it'), {
      status: 'waitingList',
      level: 'Beginner',
      stages: [stage('levelTest', 'skipped', 'Complete beginner', `2026-10-${12 + n * 4}`)],
    })
  }
  for (let n = 0; n < 36; n++) {
    const g = groups[n % 9]
    const month = n % 2 === 0 ? '09' : '10'
    const day = String(1 + (n % 27)).padStart(2, '0')
    const contract = `C-2026-0${String(100 + n)}`
    const member = students.filter((s) => s.groupId === g?.id)[Math.floor(n / 9)]
    addEnrolment(generated(30 + n, `2026-${month}-${day}`, g?.courseId), {
      status: 'completed',
      level: g?.level ?? null,
      groupId: g?.id ?? null,
      stages: fullStages(`2026-${month}-${day}`, g?.code ?? '', contract),
      contractNumber: contract,
      contractDate: `2026-${month}-${day}`,
      contractScanName: `contract-${contract}.pdf`,
      studentId: member?.id ?? null,
    })
  }
  for (let n = 0; n < 3; n++) {
    addEnrolment(generated(70 + n, `2026-10-${5 + n * 6}`), {
      status: 'lost',
      lostReason: n === 0 ? 'level' : n === 1 ? 'schedule' : 'other',
      stages: [],
    })
  }

  return {
    branches: [
      { id: HOME_BRANCH_ID, name: 'Chilonzor' },
      { id: 'b-yunusobod', name: 'Yunusobod' },
    ],
    users,
    students,
    courses: [
      { id: 'c-english', name: 'English' },
      { id: 'c-ielts', name: 'IELTS preparation' },
      { id: 'c-it', name: 'IT' },
      { id: 'c-russian', name: 'Russian' },
      { id: 'c-mental', name: 'Mental arithmetic' },
      { id: 'c-turkish', name: 'Turkish' },
    ],
    groups,
    enquiries,
    enrolments,
    lessons,
    lessonRecords,
    absenceStatuses: [],
    payments,
    discounts: [],
    callResults: [
      {
        id: 'cr-1',
        studentId: students.find((s) => s.fullName === 'Tursunov Jasur')?.id ?? '',
        month: DEMO_MONTH,
        result: 'promisedBy',
        promisedDate: '2026-11-28',
        recordedByUserId: ADMIN_ID,
        recordedAt: '2026-11-24T10:30:00',
      },
      {
        id: 'cr-2',
        studentId: students.find((s) => s.fullName === 'Ergasheva Sevara')?.id ?? '',
        month: DEMO_MONTH,
        result: 'noAnswer',
        promisedDate: null,
        recordedByUserId: ADMIN_ID,
        recordedAt: '2026-11-24T10:40:00',
      },
    ],
    grades: [
      { id: 'gr-1', studentId: MALIKA_ID, level: 'A1', kind: 'final', score: 74, published: true },
      { id: 'gr-2', studentId: MALIKA_ID, level: 'A2', kind: 'final', score: 81, published: true },
      {
        id: 'gr-3',
        studentId: MALIKA_ID,
        level: 'B1',
        kind: 'midterm',
        score: 78,
        published: true,
      },
      {
        id: 'gr-4',
        studentId: MALIKA_ID,
        level: 'B1',
        kind: 'final',
        score: null,
        published: false,
      },
      {
        id: 'gr-5',
        studentId: TIMUR_ID,
        level: 'Python',
        kind: 'midterm',
        score: 88,
        published: true,
      },
    ],
  }
}
