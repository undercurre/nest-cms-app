import { PageConfigEntity, TabItem } from '@/api/modules/product'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  const tabbarActive = ref('product')
  const token = ref('')
  const menuList = ref<TabItem[]>([])
  const pageConfig = ref<PageConfigEntity>()
  const setMenuList = (list: TabItem[]) => {
    menuList.value = list
  }

  const setPageConfig = (config: PageConfigEntity) => {
    pageConfig.value = config
  }

  return { tabbarActive, token, menuList, setMenuList, pageConfig, setPageConfig }
})
