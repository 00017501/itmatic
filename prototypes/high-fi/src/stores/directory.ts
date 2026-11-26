import { defineStore } from 'pinia'
import type { Branch, Course, Group, Student, User } from '@/types'
import { persistedRef, seedData } from './persist'

export const useDirectoryStore = defineStore('directory', () => {
  const branches = persistedRef<Branch[]>('branches', () => seedData().branches)
  const users = persistedRef<User[]>('users', () => seedData().users)
  const students = persistedRef<Student[]>('students', () => seedData().students)
  const courses = persistedRef<Course[]>('courses', () => seedData().courses)
  const groups = persistedRef<Group[]>('groups', () => seedData().groups)

  const userById = (id: string | null): User | undefined => users.value.find((u) => u.id === id)
  const studentById = (id: string | null): Student | undefined =>
    students.value.find((s) => s.id === id)
  const groupById = (id: string | null): Group | undefined => groups.value.find((g) => g.id === id)
  const courseById = (id: string | null): Course | undefined =>
    courses.value.find((c) => c.id === id)
  const branchById = (id: string | null): Branch | undefined =>
    branches.value.find((b) => b.id === id)
  const studentsInGroup = (groupId: string): Student[] =>
    students.value.filter((s) => s.groupId === groupId)
  const childrenOf = (parentId: string): Student[] =>
    students.value.filter((s) => s.parentIds.includes(parentId))

  function addUser(user: User): void {
    users.value.push(user)
  }

  function addStudent(student: Student): void {
    students.value.push(student)
  }

  return {
    branches,
    users,
    students,
    courses,
    groups,
    userById,
    studentById,
    groupById,
    courseById,
    branchById,
    studentsInGroup,
    childrenOf,
    addUser,
    addStudent,
  }
})
