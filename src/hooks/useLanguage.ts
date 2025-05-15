import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
// 获取知识空间节点信息/获取工作表/获取多个工作表范围/获取单个工作表范围
export const useLanguage = () => {
  const { locale } = useI18n()
  const route = useRoute()
  // 获取系统语言
  function setLanguage() {
    if (!localStorage.getItem('locale')) {
      const lang = typeof route.query.lang === 'string' ? route.query.lang : 'en'
      localStorage.setItem('locale', lang)
    }
    locale.value = localStorage.getItem('locale') || (Array.isArray(route.query.lang) ? route.query.lang[0] : route.query.lang) || 'en'
    localStorage.setItem('locale', locale.value)
  }
  function getLanguage() {
    return localStorage.getItem('locale') || 'en'
  }

  return {
    setLanguage,
    getLanguage
  };
};
