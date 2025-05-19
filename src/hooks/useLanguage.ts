import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
// 获取知识空间节点信息/获取工作表/获取多个工作表范围/获取单个工作表范围
export const useLanguage = () => {
  const { locale } = useI18n()
  const route = useRoute()
  // 获取系统语言
  function setLanguage(locationLanguages?: string) {
    console.log('locationLanguages: ', locationLanguages)
    const lang =
      locationLanguages ||
      (typeof route.query.lang === 'string' ? route.query.lang : localStorage.getItem('locale')) ||
      'en'
    localStorage.setItem('locale', lang == 'zh' ? 'zh-CN' : lang)
    locale.value = lang == 'zh' ? 'zh-CN' : lang
  }
  function getLanguage() {
    return localStorage.getItem('locale') || 'en'
  }

  return {
    setLanguage,
    getLanguage,
  }
}
