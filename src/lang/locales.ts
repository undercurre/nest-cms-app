import en from '@/lang/locales/en'
import zh from '@/lang/locales/zh'
import { createI18n } from 'vue-i18n'
const messages = {
  zh,
  en,
}

// 动态加载语言文件的函数
export async function loadLocaleMessages(locale) {
  // 如果语言已加载，直接返回
  if (i18n.global.availableLocales.includes(locale)) return

  try {
    // 动态导入语言文件（Webpack/Vite 会拆分 chunk）
    const messages = await import(`@/lang/locales/${locale}.ts`)
    i18n.global.setLocaleMessage(locale, messages.default || messages)
    return true
  } catch (error) {
    console.error(`Failed to load ${locale} messages:`, error)
    return false
  }
}

const i18nOptions = {
  locale: 'en',
  fallbackLocale: 'en',
  messages,
  legacy: false,
  globalInjection: true,
}
const i18n = createI18n(i18nOptions)

export default i18n
