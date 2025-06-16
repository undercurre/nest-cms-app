import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useProductStore = defineStore(
  'product',
  () => {
    const id = ref(1)
    const productModel = ref('')
    const isHasPoster = ref(false)
    const posterId = ref<number>()

    return { id, productModel, isHasPoster, posterId }
  },
  {
    persist: true,
  },
)
