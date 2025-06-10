import { getProductLanguageList, LangItem } from '@/api/modules/product'
import { ref } from 'vue'

export function useLanguageList() {
  const languageList = ref<LangItem[]>([])
  const getLanguageList = async () => {
    return new Promise(async (resolve, reject) => {
      if (!localStorage.getItem('languageList')) {
        try {
          const res = await getProductLanguageList()
          localStorage.setItem('languageList', JSON.stringify(res?.data?.languageInfoList ?? ''))
        } catch (error) {
          console.log('error: ', error)
          reject(error)
        }
      }
      languageList.value = JSON.parse(localStorage.getItem('languageList') ?? '')
      resolve(languageList.value)
    })
  }
  return {
    getLanguageList,
    languageList,
  }
}
