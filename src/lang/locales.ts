import en from '@/lang/en'
import zh from '@/lang/zh'

const messages = {
  en,
  'zh-CN': zh,
}

const i18nOptions = {
  locale: 'en',
  fallbackLocale: 'en',
  messages,
  legacy: false, // Use Composition API
  globalInjection: true,
}

export default i18nOptions
