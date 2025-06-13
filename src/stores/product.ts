import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useProductStore = defineStore(
  'product',
  () => {
    const id = ref(1)
    const productModel = ref('')
    const isHasPoster = ref(false)
    const posterImageUrls = ref<string[]>([])
    const currentPosterId = ref<number>()

    return { id, productModel, posterImageUrls, isHasPoster, currentPosterId }
  },
  {
    persist: true,
  },
)
