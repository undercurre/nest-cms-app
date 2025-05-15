import { ref } from "vue";
import { useRoute } from 'vue-router';

// 获取知识空间节点信息/获取工作表/获取多个工作表范围/获取单个工作表范围
export const useThemeMode = () => {
  const route = useRoute()
  // 获取系统色系
  const themeMode = ref('light')
  function getThemeMode() {
    if (!localStorage.getItem('themeMode')) {
      const themeMode = typeof route.query.themeMode === 'string' ? route.query.themeMode : 'light'
      localStorage.setItem('themeMode', themeMode)
    }
    themeMode.value =
      (Array.isArray(route.query.themeMode) ? route.query.themeMode[0] : route.query.themeMode) ||
      localStorage.getItem('themeMode') ||
      'light'
    toggleMode(themeMode.value === 'dark')
    console.log('当前主题:', themeMode.value)
  }

  function toggleMode(flag: boolean) {
    if (flag) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  return {
    getThemeMode,
    toggleMode,
    themeMode
  };
};
