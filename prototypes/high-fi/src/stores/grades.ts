import { defineStore } from 'pinia'
import type { Grade } from '@/types'
import { persistedRef, seedData } from './persist'

export const useGradesStore = defineStore('grades', () => {
  const grades = persistedRef<Grade[]>('grades', () => seedData().grades)

  /** Unpublished grades are never shown in an account (FR-05 validation rules). */
  const visibleGrades = (studentId: string): Grade[] =>
    grades.value.filter((g) => g.studentId === studentId && g.published && g.score !== null)
  const gradesFor = (studentId: string): Grade[] =>
    grades.value.filter((g) => g.studentId === studentId)

  return { grades, visibleGrades, gradesFor }
})
