import { getProductInfo, ProductMultiLanguage } from './../api/modules/product'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useProductStore = defineStore(
  'product',
  () => {
    const id = ref(1)
    const productModel = ref('')
    const isHasPoster = ref(false)
    const posterId = ref<number>()
    const productLanguageDtoList = ref([] as ProductMultiLanguage[])

    const getProductDetail4Store = async () => {
      const res = await getProductInfo(id.value)
      console.info('getProductDetail4Store', res)
      productModel.value = res.data.productModel
      productLanguageDtoList.value = res.data.productLanguageDtoList || []
    }

    return {
      id,
      productModel,
      isHasPoster,
      posterId,
      productLanguageDtoList,
      getProductDetail4Store,
    }
  },
  {
    persist: true,
  },
)
