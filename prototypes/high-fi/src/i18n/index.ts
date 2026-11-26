import { createI18n } from 'vue-i18n'
import type { Language } from '@/types'
import en from './en'
import ru from './ru'
import uz from './uz'

export type MessageSchema = typeof en

const saved = localStorage.getItem('itmatic:language')
const initial: Language = saved ? (JSON.parse(saved) as Language) : 'en'

export const i18n = createI18n({
  legacy: false,
  locale: initial,
  fallbackLocale: 'en',
  messages: { en, ru, uz },
})
