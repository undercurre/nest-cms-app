import { appLang } from '@/lang/app-lang'
import { loadLocaleMessages } from '@/lang/locales'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
// 获取知识空间节点信息/获取工作表/获取多个工作表范围/获取单个工作表范围
export const useLanguage = () => {
  const { locale } = useI18n()
  const route = useRoute()
  // 获取系统语言
  async function setLanguage(locationLanguages?: string) {
    let lang =
      (Array.isArray(route.query.lang) ? route.query.lang[0] : route.query.lang) ||
      locationLanguages ||
      localStorage.getItem('locale') ||
      'en'
    // 手动切换后，页面刷新就取切换的语言
    if (localStorage.getItem('isManualSwitch') == 'true') {
      lang = localStorage.getItem('locale') || 'en'
    }

    const langRes = appLang[lang] ?? lang ?? ''
    localStorage.setItem('locale', langRes || 'en')
    await loadLocaleMessages(langRes || 'en')
    locale.value = langRes || 'en'
  }
  function getLanguage() {
    return localStorage.getItem('locale') || 'en'
  }

  return {
    setLanguage,
    getLanguage,
  }
}
